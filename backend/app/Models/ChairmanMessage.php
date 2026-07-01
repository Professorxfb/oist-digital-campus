<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ChairmanMessage extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'chairman_name',
        'chairman_designation',
        'message',
        'chairman_image_path',
        'signature_image_path',
        'quote_label',
        'button_text',
        'button_url',
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

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
