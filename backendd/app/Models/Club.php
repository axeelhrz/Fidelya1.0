<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'league_id',
        'name',
        'city',
        'status',
    ];

    protected $casts = [
        'league_id' => 'integer',
        'status' => 'string',
    ];

    protected $with = ['league'];

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
}