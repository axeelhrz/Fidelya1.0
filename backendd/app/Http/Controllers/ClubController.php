<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClubController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Club::with('league');

        // Filter by league
        if ($request->has('league_id')) {
            $query->where('league_id', $request->league_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or city
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $clubs = $query->withCount('members')
                      ->orderBy('name')
                      ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $clubs,
            'message' => 'Clubs retrieved successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'league_id' => 'required|exists:leagues,id',
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'status' => 'nullable|in:active,inactive',
        ]);

        $club = Club::create(array_merge($request->all(), [
            'status' => $request->get('status', 'active')
        ]));
        $club->load('league');

        return response()->json([
            'data' => $club,
            'message' => 'Club created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Club $club): JsonResponse
    {
        $club->load(['league', 'members' => function ($query) {
            $query->orderBy('last_name')->orderBy('first_name');
        }]);

        return response()->json([
            'data' => $club,
            'message' => 'Club retrieved successfully',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Club $club): JsonResponse
    {
        // Validate based on the operation type
        $rules = [
            'name' => 'sometimes|required|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'status' => 'nullable|in:active,inactive',
        ];

        // If league_id is provided, validate it
        if ($request->has('league_id')) {
            if ($request->league_id === null) {
                // Allow null to remove club from league
                $rules['league_id'] = 'nullable';
            } else {
                // Validate that league exists
                $rules['league_id'] = 'exists:leagues,id';
            }
        }

        $request->validate($rules);

        // Update only the fields that are provided
        $updateData = $request->only(['league_id', 'name', 'city', 'address', 'status']);
        
        // Remove null values except for league_id (which we want to allow as null)
        $updateData = array_filter($updateData, function($value, $key) {
            return $value !== null || $key === 'league_id';
        }, ARRAY_FILTER_USE_BOTH);

        $club->update($updateData);
        $club->load('league');

        return response()->json([
            'data' => $club,
            'message' => 'Club updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Club $club): JsonResponse
    {
        // Check if club has members
        if ($club->members()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete club with associated members',
                'errors' => ['club' => ['This club has members associated with it']],
            ], 422);
        }

        $club->delete();

        return response()->json([
            'message' => 'Club deleted successfully',
        ]);
    }

    /**
     * Add a club to a league
     */
    public function addToLeague(Request $request, Club $club): JsonResponse
    {
        $request->validate([
            'league_id' => 'required|exists:leagues,id',
        ]);

        $club->update(['league_id' => $request->league_id]);
        $club->load('league');

        return response()->json([
            'data' => $club,
            'message' => 'Club added to league successfully',
        ]);
    }

    /**
     * Remove a club from its current league
     */
    public function removeFromLeague(Club $club): JsonResponse
    {
        $club->update(['league_id' => null]);
        $club->load('league');

        return response()->json([
            'data' => $club,
            'message' => 'Club removed from league successfully',
        ]);
    }
}