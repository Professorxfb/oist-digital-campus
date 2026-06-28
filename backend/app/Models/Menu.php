<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    public const LOCATIONS = [
        'header' => 'Header',
        'footer' => 'Footer',
        'quick_links' => 'Quick links',
    ];

    protected $fillable = [
        'name',
        'location',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('sort_order')->orderBy('label');
    }

    public function activeRootItems(): HasMany
    {
        return $this->items()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->with(['activeChildren']);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
