<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'league_id',
        'name',
        'city',
        'address',
        'logo_path',
        'status',
    ];

    protected $casts = [
        'league_id' => 'integer',
        'status' => 'string',
    ];

    protected $with = ['league', 'user'];

    /**
     * Get the user that owns this club.
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
     * Get the league that owns the club.
     */
    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    /**
     * Get the members for the club.
     */
    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    /**
     * Get active members for the club.
     */
    public function activeMembers(): HasMany
    {
        return $this->hasMany(Member::class)->where('status', 'active');
    }

    /**
     * Get member users that belong to this club.
     */
    public function memberUsers(): HasMany
    {
        return $this->hasMany(User::class, 'parent_club_id')
                    ->where('role', 'miembro');
    }

    /**
     * Scope a query to only include active clubs.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to filter by league.
     */
    public function scopeByLeague($query, $leagueId)
    {
        return $query->where('league_id', $leagueId);
    }

    /**
     * Scope a query to include full club information.
     */
    public function scopeWithFullInfo($query)
    {
        return $query->with([
            'user',
            'league.user',
            'members.user',
            'memberUsers'
        ]);
    }

    /**
     * Get the club's admin information.
     */
    public function getAdminInfoAttribute(): ?array
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
            'city' => $this->user->city,
            'address' => $this->user->address,
        ];
    }

    /**
     * Get members count.
     */
    public function getMembersCountAttribute(): int
    {
        return $this->members()->count();
    }

    /**
     * Get the full address including city.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([$this->address, $this->city]);
        return implode(', ', $parts);
    }
}