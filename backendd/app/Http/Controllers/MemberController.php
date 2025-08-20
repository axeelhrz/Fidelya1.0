<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Member::with(['club.league', 'user']);

        // Apply filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('doc_id', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('club_id') && $request->club_id) {
            $query->where('club_id', $request->club_id);
        }

        if ($request->has('gender') && $request->gender) {
            $query->where('gender', $request->gender);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('province') && $request->province) {
            $query->where('province', $request->province);
        }

        if ($request->has('city') && $request->city) {
            $query->where('city', $request->city);
        }

        if ($request->has('dominant_hand') && $request->dominant_hand) {
            $query->where('dominant_hand', $request->dominant_hand);
        }

        if ($request->has('playing_style') && $request->playing_style) {
            $query->where('playing_style', $request->playing_style);
        }

        $perPage = $request->get('per_page', 15);
        $members = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($members);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // Basic information
            'club_id' => 'required|exists:clubs,id',
            'first_name' => 'required|string|min:2|max:255',
            'last_name' => 'required|string|min:2|max:255',
            'doc_id' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'status' => 'nullable|in:active,inactive',
            
            // Location information
            'country' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            
            // Playing style information
            'dominant_hand' => 'nullable|in:right,left',
            'playing_side' => 'nullable|in:derecho,zurdo',
            'playing_style' => 'nullable|in:clasico,lapicero',
            
            // Racket information
            'racket_brand' => 'nullable|string|max:100',
            'racket_model' => 'nullable|string|max:100',
            'racket_custom_brand' => 'nullable|string|max:100',
            'racket_custom_model' => 'nullable|string|max:100',
            
            // Drive rubber information
            'drive_rubber_brand' => 'nullable|string|max:100',
            'drive_rubber_model' => 'nullable|string|max:100',
            'drive_rubber_type' => 'nullable|in:liso,pupo_largo,pupo_corto,antitopspin',
            'drive_rubber_color' => 'nullable|in:negro,rojo,verde,azul,amarillo,morado,fucsia',
            'drive_rubber_sponge' => 'nullable|string|max:20',
            'drive_rubber_hardness' => 'nullable|string|max:20',
            'drive_rubber_custom_brand' => 'nullable|string|max:100',
            'drive_rubber_custom_model' => 'nullable|string|max:100',
            
            // Backhand rubber information
            'backhand_rubber_brand' => 'nullable|string|max:100',
            'backhand_rubber_model' => 'nullable|string|max:100',
            'backhand_rubber_type' => 'nullable|in:liso,pupo_largo,pupo_corto,antitopspin',
            'backhand_rubber_color' => 'nullable|in:negro,rojo,verde,azul,amarillo,morado,fucsia',
            'backhand_rubber_sponge' => 'nullable|string|max:20',
            'backhand_rubber_hardness' => 'nullable|string|max:20',
            'backhand_rubber_custom_brand' => 'nullable|string|max:100',
            'backhand_rubber_custom_model' => 'nullable|string|max:100',
            
            // Additional information
            'notes' => 'nullable|string|max:1000',
            'ranking_position' => 'nullable|integer|min:1',
            'ranking_last_updated' => 'nullable|date',
            'photo_path' => 'nullable|string|max:255',
        ]);

        // Convert birth_date to birthdate for database compatibility
        if (isset($validated['birth_date'])) {
            $validated['birthdate'] = $validated['birth_date'];
            unset($validated['birth_date']);
        }

        // Set default values
        $validated['status'] = $validated['status'] ?? 'active';
        $validated['country'] = $validated['country'] ?? 'Ecuador';

        $member = Member::create($validated);
        $member->load(['club.league', 'user']);

        return response()->json([
            'message' => 'Miembro creado exitosamente',
            'data' => $member
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member): JsonResponse
    {
        $member->load(['club.league', 'user']);
        return response()->json(['data' => $member]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member): JsonResponse
    {
        $validated = $request->validate([
            // Basic information
            'club_id' => 'sometimes|required|exists:clubs,id',
            'first_name' => 'sometimes|required|string|min:2|max:255',
            'last_name' => 'sometimes|required|string|min:2|max:255',
            'doc_id' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'status' => 'nullable|in:active,inactive',
            
            // Location information
            'country' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            
            // Playing style information
            'dominant_hand' => 'nullable|in:right,left',
            'playing_side' => 'nullable|in:derecho,zurdo',
            'playing_style' => 'nullable|in:clasico,lapicero',
            
            // Racket information
            'racket_brand' => 'nullable|string|max:100',
            'racket_model' => 'nullable|string|max:100',
            'racket_custom_brand' => 'nullable|string|max:100',
            'racket_custom_model' => 'nullable|string|max:100',
            
            // Drive rubber information
            'drive_rubber_brand' => 'nullable|string|max:100',
            'drive_rubber_model' => 'nullable|string|max:100',
            'drive_rubber_type' => 'nullable|in:liso,pupo_largo,pupo_corto,antitopspin',
            'drive_rubber_color' => 'nullable|in:negro,rojo,verde,azul,amarillo,morado,fucsia',
            'drive_rubber_sponge' => 'nullable|string|max:20',
            'drive_rubber_hardness' => 'nullable|string|max:20',
            'drive_rubber_custom_brand' => 'nullable|string|max:100',
            'drive_rubber_custom_model' => 'nullable|string|max:100',
            
            // Backhand rubber information
            'backhand_rubber_brand' => 'nullable|string|max:100',
            'backhand_rubber_model' => 'nullable|string|max:100',
            'backhand_rubber_type' => 'nullable|in:liso,pupo_largo,pupo_corto,antitopspin',
            'backhand_rubber_color' => 'nullable|in:negro,rojo,verde,azul,amarillo,morado,fucsia',
            'backhand_rubber_sponge' => 'nullable|string|max:20',
            'backhand_rubber_hardness' => 'nullable|string|max:20',
            'backhand_rubber_custom_brand' => 'nullable|string|max:100',
            'backhand_rubber_custom_model' => 'nullable|string|max:100',
            
            // Additional information
            'notes' => 'nullable|string|max:1000',
            'ranking_position' => 'nullable|integer|min:1',
            'ranking_last_updated' => 'nullable|date',
            'photo_path' => 'nullable|string|max:255',
        ]);

        // Convert birth_date to birthdate for database compatibility
        if (isset($validated['birth_date'])) {
            $validated['birthdate'] = $validated['birth_date'];
            unset($validated['birth_date']);
        }

        $member->update($validated);
        $member->load(['club.league', 'user']);

        return response()->json([
            'message' => 'Miembro actualizado exitosamente',
            'data' => $member
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member): JsonResponse
    {
        $member->delete();

        return response()->json([
            'message' => 'Miembro eliminado exitosamente'
        ]);
    }

    /**
     * Get equipment reference data for forms
     */
    public function getEquipmentData(): JsonResponse
    {
        return response()->json([
            'brands' => [
                'racket' => \DB::table('racket_brands')->where('is_active', true)->get(),
                'rubber' => \DB::table('rubber_brands')->where('is_active', true)->get(),
            ],
            'locations' => \DB::table('ecuador_locations')->where('is_active', true)->get(),
            'constants' => [
                'rubber_colors' => ['negro', 'rojo', 'verde', 'azul', 'amarillo', 'morado', 'fucsia'],
                'rubber_types' => ['liso', 'pupo_largo', 'pupo_corto', 'antitopspin'],
                'sponge_thicknesses' => ['0.5', '0.7', '1.5', '1.6', '1.8', '1.9', '2', '2.1', '2.2', 'sin esponja'],
                'hardness_levels' => ['h42', 'h44', 'h46', 'h48', 'h50', 'n/a'],
            ]
        ]);
    }
}
