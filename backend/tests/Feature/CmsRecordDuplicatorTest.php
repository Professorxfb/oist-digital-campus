<?php

namespace Tests\Feature;

use App\Models\AcademicProgram;
use App\Models\HomepageSection;
use App\Models\Notice;
use App\Support\CmsRecordDuplicator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsRecordDuplicatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_duplicates_notice_as_unpublished_unique_copy(): void
    {
        Notice::query()->create([
            'title' => 'Admission Notice',
            'slug' => 'admission-notice-copy',
            'is_published' => false,
        ]);

        $notice = Notice::query()->create([
            'title' => 'Admission Notice',
            'slug' => 'admission-notice',
            'body' => '<p>Body</p>',
            'content_blocks' => [
                ['type' => 'image', 'image_path' => 'cms/notices/content/images/body.webp'],
            ],
            'featured_image_path' => 'cms/notices/images/card.webp',
            'attachment_path' => 'cms/notices/attachments/file.pdf',
            'video_url' => 'https://youtu.be/video',
            'is_published' => true,
            'published_at' => now()->subDay(),
            'expires_at' => now()->addDay(),
            'sort_order' => 4,
        ]);

        $copy = CmsRecordDuplicator::duplicate($notice)->refresh();

        $this->assertSame('Admission Notice Copy', $copy->title);
        $this->assertSame('admission-notice-copy-2', $copy->slug);
        $this->assertFalse($copy->is_published);
        $this->assertNull($copy->published_at);
        $this->assertNull($copy->expires_at);
        $this->assertSame(5, $copy->sort_order);
        $this->assertSame('cms/notices/images/card.webp', $copy->featured_image_path);
        $this->assertSame('cms/notices/attachments/file.pdf', $copy->attachment_path);
        $this->assertSame('https://youtu.be/video', $copy->video_url);
        $this->assertSame($notice->content_blocks, $copy->content_blocks);
    }

    public function test_it_duplicates_academic_program_as_unpublished_copy(): void
    {
        $program = AcademicProgram::query()->create([
            'title' => 'Diploma Program',
            'slug' => 'diploma-program',
            'bullet_points' => ['Lab', 'Project'],
            'featured_image_path' => 'cms/academic-programs/program.webp',
            'is_published' => true,
            'sort_order' => 2,
        ]);

        $copy = CmsRecordDuplicator::duplicate($program)->refresh();

        $this->assertSame('Diploma Program Copy', $copy->title);
        $this->assertSame('diploma-program-copy', $copy->slug);
        $this->assertFalse($copy->is_published);
        $this->assertSame(3, $copy->sort_order);
        $this->assertSame(['Lab', 'Project'], $copy->bullet_points);
        $this->assertSame('cms/academic-programs/program.webp', $copy->featured_image_path);
    }

    public function test_it_duplicates_homepage_section_with_unique_disabled_key(): void
    {
        HomepageSection::query()->create([
            'key' => 'about_copy',
            'title' => 'About Copy',
        ]);

        $section = HomepageSection::query()->create([
            'key' => 'about',
            'title' => 'About',
            'metadata' => ['video_url' => 'https://youtu.be/video'],
            'is_enabled' => true,
            'sort_order' => 9,
        ]);

        $copy = CmsRecordDuplicator::duplicate($section)->refresh();

        $this->assertSame('about_copy_2', $copy->key);
        $this->assertSame('About Copy', $copy->title);
        $this->assertFalse($copy->is_enabled);
        $this->assertSame(10, $copy->sort_order);
        $this->assertSame(['video_url' => 'https://youtu.be/video'], $copy->metadata);
    }
}
