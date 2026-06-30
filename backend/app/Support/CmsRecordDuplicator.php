<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CmsRecordDuplicator
{
    public static function duplicate(Model $record): Model
    {
        $copy = $record->replicate();

        foreach (['title', 'name'] as $field) {
            if (array_key_exists($field, $copy->getAttributes()) && filled($copy->{$field})) {
                $copy->{$field} = self::copyLabel((string) $copy->{$field});
            }
        }

        if (array_key_exists('meta_title', $copy->getAttributes()) && filled($copy->meta_title)) {
            $copy->meta_title = self::copyLabel((string) $copy->meta_title);
        }

        if (array_key_exists('slug', $copy->getAttributes())) {
            $baseSlug = Str::slug(Str::beforeLast((string) $record->getAttribute('slug'), '-copy'));
            $copy->slug = self::uniqueValue($record, 'slug', "{$baseSlug}-copy", '-');
        }

        if (array_key_exists('key', $copy->getAttributes())) {
            $baseKey = Str::of((string) $record->getAttribute('key'))
                ->beforeLast('_copy')
                ->replaceMatches('/[^A-Za-z0-9_-]+/', '_')
                ->trim('_-')
                ->lower()
                ->toString();

            $copy->key = self::uniqueValue($record, 'key', "{$baseKey}_copy", '_');
        }

        foreach (['is_published', 'is_enabled', 'is_active'] as $field) {
            if (array_key_exists($field, $copy->getAttributes())) {
                $copy->{$field} = false;
            }
        }

        if (array_key_exists('published_at', $copy->getAttributes())) {
            $copy->published_at = null;
        }

        if ($record->getTable() === 'notices' && array_key_exists('expires_at', $copy->getAttributes())) {
            $copy->expires_at = null;
        }

        if (array_key_exists('sort_order', $copy->getAttributes())) {
            $copy->sort_order = ((int) $record->newQueryWithoutScopes()->max('sort_order')) + 1;
        }

        $copy->save();

        return $copy;
    }

    private static function copyLabel(string $value): string
    {
        return Str::endsWith($value, ' Copy') ? $value : "{$value} Copy";
    }

    private static function uniqueValue(Model $record, string $column, string $baseValue, string $separator): string
    {
        $value = $baseValue;
        $counter = 2;

        while ($record->newQueryWithoutScopes()->where($column, $value)->exists()) {
            $value = "{$baseValue}{$separator}{$counter}";
            $counter++;
        }

        return $value;
    }
}
