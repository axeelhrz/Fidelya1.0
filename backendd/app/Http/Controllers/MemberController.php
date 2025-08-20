<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Member::with(['club.league']);

        // Filter by club
        if ($request->has('club_id')) {
            $query->where('club_id', $request->club_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by gender
        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        // Search by name, email, or doc_id
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('doc_id', 'like', "%{$search}%");
            });
        }

        $members = $query->orderBy('last_name')
                        ->orderBy('first_name')
                        ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $members,
            'message' => 'Members retrieved successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'doc_id' => 'nullable|string|max:255|unique:members,doc_id',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'status' => 'nullable|in:active,inactive',
        ]);

        $member = Member::create($request->all());
        $member->load(['club.league']);

        return response()->json([
            'data' => $member,
            'message' => 'Member created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member): JsonResponse
    {
        $member->load(['club.league']);

        return response()->json([
            'data' => $member,
            'message' => 'Member retrieved successfully',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member): JsonResponse
    {
        $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'doc_id' => 'nullable|string|max:255|unique:members,doc_id,' . $member->id,
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'status' => 'nullable|in:active,inactive',
        ]);

        $member->update($request->all());
        $member->load(['club.league']);

        return response()->json([
            'data' => $member,
            'message' => 'Member updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member): JsonResponse
    {
        $member->delete();

        return response()->json([
            'message' => 'Member deleted successfully',
        ]);
    }
}