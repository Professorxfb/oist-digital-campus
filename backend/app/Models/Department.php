<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'description',
        'featured_image_path',
        'icon',
        'sort_order',
        'is_published',
        'meta_title',
        'meta_description',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    public function facultyProfiles(): HasMany
    {
        return $this->hasMany(FacultyProfile::class)->orderBy('sort_order')->orderBy('name');
    }

    public function publishedFacultyProfiles(): HasMany
    {
        return $this->facultyProfiles()->where('is_published', true);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
