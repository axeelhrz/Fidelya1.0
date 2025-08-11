<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class League extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'region',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the clubs for the league.
     */
    public function clubs(): HasMany
    {
        return $this->hasMany(Club::class);
    }

    /**
     * Get active clubs for the league.
     */
    public function activeClubs(): HasMany
    {
        return $this->hasMany(Club::class)->where('status', 'active');
    }

    /**
     * Scope a query to only include active leagues.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}