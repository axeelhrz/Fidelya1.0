<?php

namespace App\Http\Controllers;

use App\Models\QuickRegistration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class QuickRegistrationController extends Controller
{
    /**
     * Store a new quick registration.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|min:2|max:255',
            'last_name' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255|unique:quick_registrations,email',
            'phone' => 'required|string|min:10|max:20',
            'doc_id' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'interest_type' => 'required|in:player,club_owner,league_admin',
            'preferred_sport' => 'nullable|string|max:100',
            'experience_level' => 'nullable|in:beginner,intermediate,advanced',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Add metadata
        $validated['metadata'] = [
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'registration_source' => 'quick_registration_form',
            'timestamp' => now()->toISOString(),
        ];

        $registration = QuickRegistration::create($validated);

        return response()->json([
            'message' => 'Registro exitoso. Te contactaremos pronto.',
            'data' => $registration,
            'registration_id' => $registration->id,
        ], 201);
    }

    /**
     * Get all quick registrations (admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $query = QuickRegistration::query();

        // Apply filters
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('interest_type') && $request->interest_type) {
            $query->where('interest_type', $request->interest_type);
        }

        if ($request->has('province') && $request->province) {
            $query->where('province', $request->province);
        }

        if ($request->has('city') && $request->city) {
            $query->where('city', $request->city);
        }

        if ($request->has('preferred_sport') && $request->preferred_sport) {
            $query->where('preferred_sport', $request->preferred_sport);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('doc_id', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $registrations = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($registrations);
    }

    /**
     * Show a specific registration.
     */
    public function show(QuickRegistration $quickRegistration): JsonResponse
    {
        return response()->json(['data' => $quickRegistration]);
    }

    /**
     * Update registration status.
     */
    public function updateStatus(Request $request, QuickRegistration $quickRegistration): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,contacted,approved,rejected',
            'notes' => 'nullable|string|max:1000',
        ]);

        $quickRegistration->update(['status' => $validated['status']]);

        // Update timestamps based on status
        switch ($validated['status']) {
            case 'contacted':
                $quickRegistration->markAsContacted();
                break;
            case 'approved':
                $quickRegistration->markAsApproved();
                break;
        }

        // Add admin notes to metadata if provided
        if (isset($validated['notes'])) {
            $metadata = $quickRegistration->metadata ?? [];
            $metadata['admin_notes'] = $validated['notes'];
            $metadata['status_updated_at'] = now()->toISOString();
            $quickRegistration->update(['metadata' => $metadata]);
        }

        return response()->json([
            'message' => 'Estado actualizado exitosamente',
            'data' => $quickRegistration->fresh(),
        ]);
    }

    /**
     * Get registration statistics.
     */
    public function getStatistics(): JsonResponse
    {
        $stats = [
            'total_registrations' => QuickRegistration::count(),
            'pending_registrations' => QuickRegistration::pending()->count(),
            'contacted_registrations' => QuickRegistration::contacted()->count(),
            'approved_registrations' => QuickRegistration::approved()->count(),
            'rejected_registrations' => QuickRegistration::where('status', 'rejected')->count(),

            'by_interest_type' => QuickRegistration::select('interest_type', DB::raw('count(*) as count'))
                ->groupBy('interest_type')
                ->get(),

            'by_province' => QuickRegistration::select('province', DB::raw('count(*) as count'))
                ->groupBy('province')
                ->orderBy('count', 'desc')
                ->get(),

            'by_sport' => QuickRegistration::select('preferred_sport', DB::raw('count(*) as count'))
                ->whereNotNull('preferred_sport')
                ->groupBy('preferred_sport')
                ->orderBy('count', 'desc')
                ->get(),

            'recent_registrations' => QuickRegistration::where('created_at', '>=', now()->subDays(7))
                ->count(),

            'average_age' => QuickRegistration::whereNotNull('birth_date')
                ->selectRaw('AVG(YEAR(CURDATE()) - YEAR(birth_date)) as avg_age')
                ->value('avg_age'),

            'registrations_by_day' => QuickRegistration::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('count(*) as count')
                )
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Check if email is already registered.
     */
    public function checkEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $exists = QuickRegistration::where('email', $request->email)->exists();

        return response()->json([
            'exists' => $exists,
            'message' => $exists ? 'Este email ya está registrado' : 'Email disponible',
        ]);
    }

    /**
     * Get waiting room status for a specific email.
     */
    public function getWaitingRoomStatus(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $registration = QuickRegistration::where('email', $request->email)->first();

        if (!$registration) {
            return response()->json([
                'found' => false,
                'message' => 'No se encontró registro con este email',
            ], 404);
        }

        return response()->json([
            'found' => true,
            'data' => [
                'id' => $registration->id,
                'full_name' => $registration->full_name,
                'status' => $registration->status,
                'status_label' => $registration->status_label,
                'status_color' => $registration->status_color,
                'days_waiting' => $registration->days_waiting,
                'interest_type' => $registration->interest_type,
                'interest_type_label' => $registration->interest_type_label,
                'preferred_sport' => $registration->preferred_sport,
                'location_summary' => $registration->location_summary,
                'created_at' => $registration->created_at,
                'contacted_at' => $registration->contacted_at,
                'approved_at' => $registration->approved_at,
            ],
        ]);
    }

    /**
     * Delete a registration.
     */
    public function destroy(QuickRegistration $quickRegistration): JsonResponse
    {
        $quickRegistration->delete();

        return response()->json([
            'message' => 'Registro eliminado exitosamente',
        ]);
    }
}