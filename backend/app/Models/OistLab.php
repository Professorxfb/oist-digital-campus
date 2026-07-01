<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class OistLab extends Model
{
    protected $fillable = [
        'title',
        'main_image_path',
        'gallery_images',
        'gallery_captions',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'gallery_images' => 'array',
            'gallery_captions' => 'array',
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
