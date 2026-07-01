<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CampusLifeSection extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'image_path',
        'video_path',
        'video_url',
        'gallery_images',
        'button_text',
        'button_url',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'gallery_images' => 'array',
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
