<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class AboutSection extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'content',
        'main_image_path',
        'gallery_images',
        'video_path',
        'video_url',
        'button_text',
        'button_url',
        'feature_bullets',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'gallery_images' => 'array',
            'feature_bullets' => 'array',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
