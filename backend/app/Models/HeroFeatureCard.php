<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class HeroFeatureCard extends Model
{
    public const ICONS = [
        'library' => 'Library',
        'educator' => 'Educator',
        'achievement' => 'Achievement',
        'default' => 'Default',
    ];

    public const STYLE_VARIANTS = [
        'navy' => 'Navy',
        'yellow' => 'Yellow',
    ];

    protected $fillable = [
        'title',
        'description',
        'icon_key',
        'image_path',
        'style_variant',
        'button_text',
        'button_url',
        'sort_order',
        'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeEnabled(Builder $query): Builder
    {
        return $query->where('is_enabled', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
