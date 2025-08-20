<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class QuickRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'doc_id',
        'birth_date',
        'gender',
        'province',
        'city',
        'interest_type',
        'preferred_sport',
        'experience_level',
        'notes',
        'status',
        'contacted_at',
        'approved_at',
        'metadata',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'contacted_at' => 'datetime',
        'approved_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected $appends = ['full_name', 'age', 'days_waiting'];

    /**
     * Get the person's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get the person's age.
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->birth_date) {
            return null;
        }

        return $this->birth_date->diffInYears(now());
    }

    /**
     * Get days waiting since registration.
     */
    public function getDaysWaitingAttribute(): int
    {
        return $this->created_at->diffInDays(now());
    }

    /**
     * Scope a query to only include pending registrations.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include contacted registrations.
     */
    public function scopeContacted($query)
    {
        return $query->where('status', 'contacted');
    }

    /**
     * Scope a query to only include approved registrations.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to filter by interest type.
     */
    public function scopeByInterest($query, $interestType)
    {
        return $query->where('interest_type', $interestType);
    }

    /**
     * Scope a query to filter by location.
     */
    public function scopeByLocation($query, $province = null, $city = null)
    {
        if ($province) {
            $query->where('province', $province);
        }
        if ($city) {
            $query->where('city', $city);
        }
        return $query;
    }

    /**
     * Scope a query to filter by sport.
     */
    public function scopeBySport($query, $sport)
    {
        return $query->where('preferred_sport', $sport);
    }

    /**
     * Mark as contacted.
     */
    public function markAsContacted(): bool
    {
        return $this->update([
            'status' => 'contacted',
            'contacted_at' => now(),
        ]);
    }

    /**
     * Mark as approved.
     */
    public function markAsApproved(): bool
    {
        return $this->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);
    }

    /**
     * Mark as rejected.
     */
    public function markAsRejected(): bool
    {
        return $this->update([
            'status' => 'rejected',
        ]);
    }

    /**
     * Get interest type label.
     */
    public function getInterestTypeLabelAttribute(): string
    {
        return match($this->interest_type) {
            'player' => 'Jugador/Miembro',
            'club_owner' => 'Administrador de Club',
            'league_admin' => 'Administrador de Liga',
            default => 'No especificado',
        };
    }

    /**
     * Get experience level label.
     */
    public function getExperienceLevelLabelAttribute(): ?string
    {
        if (!$this->experience_level) {
            return null;
        }

        return match($this->experience_level) {
            'beginner' => 'Principiante',
            'intermediate' => 'Intermedio',
            'advanced' => 'Avanzado',
            default => 'No especificado',
        };
    }

    /**
     * Get status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Pendiente',
            'contacted' => 'Contactado',
            'approved' => 'Aprobado',
            'rejected' => 'Rechazado',
            default => 'Desconocido',
        };
    }

    /**
     * Get status color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'contacted' => 'blue',
            'approved' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }

    /**
     * Check if registration is recent (within 24 hours).
     */
    public function getIsRecentAttribute(): bool
    {
        return $this->created_at->diffInHours(now()) <= 24;
    }

    /**
     * Get location summary.
     */
    public function getLocationSummaryAttribute(): string
    {
        return $this->city . ', ' . $this->province;
    }
}