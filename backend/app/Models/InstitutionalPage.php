<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class InstitutionalPage extends Model
{
    public const PAGE_TYPES = [
        'about' => 'About',
        'mission' => 'Mission',
        'vision' => 'Vision',
        'values' => 'Values',
        'why_choose_us' => 'Why Choose Us',
        'campus_life' => 'Campus Life',
        'facilities' => 'Facilities',
        'accreditation' => 'Accreditation',
        'student_support' => 'Student Support',
        'general' => 'General',
    ];

    protected $fillable = [
        'title',
        'slug',
        'page_type',
        'excerpt',
        'body',
        'featured_image_path',
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

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
