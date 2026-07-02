<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacultyProfile extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'designation',
        'department_id',
        'photo_path',
        'short_bio',
        'detailed_bio',
        'qualifications',
        'research_interests',
        'expertise',
        'email',
        'phone',
        'office_location',
        'facebook_url',
        'linkedin_url',
        'twitter_url',
        'website_url',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
