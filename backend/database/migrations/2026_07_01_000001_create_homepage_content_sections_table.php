<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_sections', function (Blueprint $table): void {
            $table->id();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->longText('content')->nullable();
            $table->string('hero_image_path')->nullable();
            $table->string('video_path')->nullable();
            $table->text('video_url')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->string('secondary_button_text')->nullable();
            $table->string('secondary_button_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('about_sections', function (Blueprint $table): void {
            $table->id();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->longText('content')->nullable();
            $table->string('main_image_path')->nullable();
            $table->json('gallery_images')->nullable();
            $table->string('video_path')->nullable();
            $table->text('video_url')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->json('feature_bullets')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('chairman_messages', function (Blueprint $table): void {
            $table->id();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('chairman_name')->nullable();
            $table->string('chairman_designation')->nullable();
            $table->longText('message')->nullable();
            $table->string('chairman_image_path')->nullable();
            $table->string('signature_image_path')->nullable();
            $table->string('quote_label')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('oist_labs', function (Blueprint $table): void {
            $table->id();
            $table->string('title')->nullable();
            $table->string('main_image_path')->nullable();
            $table->json('gallery_images')->nullable();
            $table->json('gallery_captions')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('campus_life_sections', function (Blueprint $table): void {
            $table->id();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->longText('description')->nullable();
            $table->string('image_path')->nullable();
            $table->string('video_path')->nullable();
            $table->text('video_url')->nullable();
            $table->json('gallery_images')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();
        });

        $this->copyExistingHomepageContent();
    }

    public function down(): void
    {
        Schema::dropIfExists('campus_life_sections');
        Schema::dropIfExists('oist_labs');
        Schema::dropIfExists('chairman_messages');
        Schema::dropIfExists('about_sections');
        Schema::dropIfExists('hero_sections');
    }

    private function copyExistingHomepageContent(): void
    {
        if (! Schema::hasTable('homepage_sections')) {
            return;
        }

        $now = now();

        foreach (DB::table('homepage_sections')->whereIn('key', [
            'hero',
            'about',
            'about_intro',
            'institution_intro',
            'chairman_message',
            'oist_lab',
            'campus_life',
            'gallery_campus_life',
        ])->get() as $section) {
            $metadata = $this->metadata($section->metadata ?? null);
            $base = [
                'sort_order' => (int) ($section->sort_order ?? 0),
                'is_published' => (bool) ($section->is_enabled ?? false),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            if ($section->key === 'hero' && DB::table('hero_sections')->count() === 0) {
                DB::table('hero_sections')->insert($base + [
                    'title' => $section->title,
                    'subtitle' => $section->subtitle,
                    'content' => $section->content,
                    'hero_image_path' => $section->image_path,
                    'video_path' => $section->video_path,
                    'video_url' => $this->metadataText($metadata, ['video_url', 'youtube_url', 'embed_url', 'external_video_url']),
                    'button_text' => $section->button_text,
                    'button_url' => $section->button_url,
                    'secondary_button_text' => $this->metadataText($metadata, ['secondary_button_text']),
                    'secondary_button_url' => $this->metadataText($metadata, ['secondary_button_url']),
                ]);
            }

            if (in_array($section->key, ['about', 'about_intro', 'institution_intro'], true) && DB::table('about_sections')->count() === 0) {
                DB::table('about_sections')->insert($base + [
                    'title' => $section->title,
                    'subtitle' => $section->subtitle,
                    'content' => $section->content,
                    'main_image_path' => $section->image_path,
                    'gallery_images' => $this->json($this->metadataList($metadata, ['gallery_images', 'images', 'media_images'])),
                    'video_path' => $section->video_path,
                    'video_url' => $this->metadataText($metadata, ['video_url', 'youtube_url', 'embed_url', 'external_video_url']),
                    'button_text' => $section->button_text,
                    'button_url' => $section->button_url,
                    'feature_bullets' => $this->json($this->metadataList($metadata, ['features', 'feature_list', 'bullets', 'items'])),
                ]);
            }

            if ($section->key === 'chairman_message' && DB::table('chairman_messages')->count() === 0) {
                DB::table('chairman_messages')->insert($base + [
                    'title' => $section->title,
                    'subtitle' => $section->subtitle,
                    'chairman_name' => $this->metadataText($metadata, ['chairman_name', 'name']),
                    'chairman_designation' => $this->metadataText($metadata, ['chairman_designation', 'designation', 'role']),
                    'message' => $section->content,
                    'chairman_image_path' => $section->image_path,
                    'signature_image_path' => $this->metadataText($metadata, ['signature_image', 'signature_path']),
                    'quote_label' => $this->metadataText($metadata, ['quote_label']),
                    'button_text' => $section->button_text,
                    'button_url' => $section->button_url,
                ]);
            }

            if ($section->key === 'oist_lab' && DB::table('oist_labs')->count() === 0) {
                DB::table('oist_labs')->insert($base + [
                    'title' => $section->title,
                    'main_image_path' => $section->image_path,
                    'gallery_images' => $this->json($this->metadataList($metadata, ['gallery_images', 'images', 'media_images'])),
                    'gallery_captions' => $this->json($this->metadataList($metadata, ['gallery_captions', 'captions', 'image_captions'])),
                ]);
            }

            if (in_array($section->key, ['campus_life', 'gallery_campus_life'], true) && DB::table('campus_life_sections')->count() === 0) {
                DB::table('campus_life_sections')->insert($base + [
                    'title' => $section->title,
                    'subtitle' => $section->subtitle,
                    'description' => $section->content,
                    'image_path' => $section->image_path,
                    'video_path' => $section->video_path,
                    'video_url' => $this->metadataText($metadata, ['video_url', 'youtube_url', 'embed_url', 'external_video_url']),
                    'gallery_images' => $this->json($this->metadataList($metadata, ['gallery_images', 'images', 'media_images'])),
                    'button_text' => $section->button_text,
                    'button_url' => $section->button_url,
                ]);
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function metadata(mixed $value): array
    {
        if (is_array($value)) {
            return $value;
        }

        if (! is_string($value) || trim($value) === '') {
            return [];
        }

        $decoded = json_decode($value, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param array<string, mixed> $metadata
     * @param array<int, string> $keys
     */
    private function metadataText(array $metadata, array $keys): ?string
    {
        foreach ($keys as $key) {
            $value = $metadata[$key] ?? null;

            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        return null;
    }

    /**
     * @param array<string, mixed> $metadata
     * @param array<int, string> $keys
     * @return array<int, mixed>|null
     */
    private function metadataList(array $metadata, array $keys): ?array
    {
        foreach ($keys as $key) {
            $value = $metadata[$key] ?? null;

            if (is_array($value)) {
                return array_values(array_filter($value, fn (mixed $item): bool => $item !== null && $item !== ''));
            }

            if (is_string($value) && trim($value) !== '') {
                return array_values(array_filter(array_map('trim', preg_split('/\r?\n|\||,/', $value) ?: [])));
            }
        }

        return null;
    }

    /**
     * @param array<int, mixed>|null $value
     */
    private function json(?array $value): ?string
    {
        return $value ? json_encode($value) : null;
    }
};
