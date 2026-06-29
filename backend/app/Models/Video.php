<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    public const VIDEO_TYPES = [
        'youtube' => 'YouTube',
        'facebook' => 'Facebook',
        'vimeo' => 'Vimeo',
        'uploaded' => 'Uploaded',
        'external' => 'External',
    ];

    public const CATEGORIES = [
        'lab_showcase' => 'Lab Showcase',
        'campus_tour' => 'Campus Tour',
        'event' => 'Event',
        'seminar' => 'Seminar',
        'workshop' => 'Workshop',
        'student_project' => 'Student Project',
        'admission_guide' => 'Admission Guide',
        'promotional' => 'Promotional',
        'general' => 'General',
    ];

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'description',
        'video_type',
        'video_url',
        'embed_url',
        'thumbnail_path',
        'category',
        'tags',
        'event_date',
        'is_featured',
        'is_published',
        'published_at',
        'sort_order',
        'meta_title',
        'meta_description',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'event_date' => 'date',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_published', true)
            ->where(function (Builder $query): void {
                $query->whereNull('published_at')->orWhere('published_at', '<=', now());
            });
    }
}
