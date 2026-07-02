<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionApplication extends Model
{
    public const STATUSES = [
        'new' => 'New',
        'contacted' => 'Contacted',
        'reviewed' => 'Reviewed',
        'accepted' => 'Accepted',
        'rejected' => 'Rejected',
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'country',
        'city',
        'zip_code',
        'date_of_birth',
        'message',
        'preferred_program',
        'status',
        'notes',
        'source',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function getApplicantNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}
