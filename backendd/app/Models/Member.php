<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'club_id',
        'first_name',
        'last_name',
        'doc_id',
        'email',
        'phone',
        'birthdate',
        'gender',
        'rubber_type',
        'ranking',
        'photo_path',
        'status',
    ];

    protected $casts = [
        'club_id' => 'integer',
        'birthdate' => 'date',
        'gender' => 'string',
        'status' => 'string',
    ];

    protected $with = ['club', 'user'];

    protected $appends = ['full_name'];

    /**
     * Get the user that owns this member.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user as a polymorphic relation.
     */
    public function userRole(): MorphOne
    {
        return $this->morphOne(User::class, 'roleable');
    }

    /**
     * Get the club that owns the member.
     */
    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    /**
     * Get the league through the club.
     */
    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class, 'league_id', 'id')
                    ->through('club');
    }

    /**
     * Get the member's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get the member's age.
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->birthdate) {
            return null;
        }

        return $this->birthdate->diffInYears(now());
    }

    /**
     * Get the member's user information.
     */
    public function getUserInfoAttribute(): ?array
    {
        if (!$this->user) {
            return null;
        }

        return [
            'id' => $this->user->id,
            'name' => $this->user->name,
            'email' => $this->user->email,
            'phone' => $this->user->phone,
            'country' => $this->user->country,
            'full_name' => $this->user->full_name,
            'birth_date' => $this->user->birth_date,
            'gender' => $this->user->gender,
            'rubber_type' => $this->user->rubber_type,
            'ranking' => $this->user->ranking,
            'photo_path' => $this->user->photo_path,
        ];
    }

    /**
     * Scope a query to only include active members.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to filter by club.
     */
    public function scopeByClub($query, $clubId)
    {
        return $query->where('club_id', $clubId);
    }

    /**
     * Scope a query to filter by gender.
     */
    public function scopeByGender($query, $gender)
    {
        return $query->where('gender', $gender);
    }

    /**
     * Scope a query to include full member information.
     */
    public function scopeWithFullInfo($query)
    {
        return $query->with([
            'user',
            'club.user',
            'club.league.user'
        ]);
    }

    /**
     * Get the member's hierarchy information.
     */
    public function getHierarchyAttribute(): array
    {
        return [
            'member' => [
                'id' => $this->id,
                'name' => $this->full_name,
                'user' => $this->user_info,
            ],
            'club' => [
                'id' => $this->club->id,
                'name' => $this->club->name,
                'user' => $this->club->admin_info,
            ],
            'league' => [
                'id' => $this->club->league->id,
                'name' => $this->club->league->name,
                'user' => $this->club->league->admin_info,
            ],
        ];
    }
}