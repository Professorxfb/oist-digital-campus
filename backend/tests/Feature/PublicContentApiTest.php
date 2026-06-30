<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\AcademicProgram;
use App\Models\Download;
use App\Models\Event;
use App\Models\FacultyProfile;
use App\Models\GalleryAlbum;
use App\Models\GalleryItem;
use App\Models\NewsPost;
use App\Models\Notice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_list_apis_return_only_published_content(): void
    {
        Notice::query()->create([
            'title' => 'Published Notice',
            'slug' => 'published-notice',
            'content_blocks' => [
                [
                    'type' => 'image',
                    'title' => 'Notice image',
                    'image_path' => 'cms/notices/content/images/published.webp',
                ],
            ],
            'featured_image_path' => 'cms/notices/images/published.webp',
            'attachment_path' => 'cms/notices/attachments/published.pdf',
            'external_link' => 'https://example.com/published-notice',
            'video_url' => 'https://www.youtube.com/watch?v=example',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);
        Notice::query()->create([
            'title' => 'Hidden Notice',
            'slug' => 'hidden-notice',
            'is_published' => false,
        ]);

        NewsPost::query()->create([
            'title' => 'Published News',
            'slug' => 'published-news',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);
        NewsPost::query()->create([
            'title' => 'Hidden News',
            'slug' => 'hidden-news',
            'is_published' => false,
        ]);

        Event::query()->create([
            'title' => 'Published Event',
            'slug' => 'published-event',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);
        Event::query()->create([
            'title' => 'Hidden Event',
            'slug' => 'hidden-event',
            'is_published' => false,
        ]);

        GalleryAlbum::query()->create([
            'title' => 'Published Album',
            'slug' => 'published-album',
            'is_published' => true,
        ]);
        GalleryAlbum::query()->create([
            'title' => 'Hidden Album',
            'slug' => 'hidden-album',
            'is_published' => false,
        ]);

        Download::query()->create([
            'title' => 'Published Download',
            'slug' => 'published-download',
            'file_path' => 'cms/downloads/file.pdf',
            'is_published' => true,
        ]);
        Download::query()->create([
            'title' => 'Hidden Download',
            'slug' => 'hidden-download',
            'file_path' => 'cms/downloads/hidden.pdf',
            'is_published' => false,
        ]);

        Department::query()->create([
            'name' => 'Published Department',
            'slug' => 'published-department',
            'is_published' => true,
        ]);
        Department::query()->create([
            'name' => 'Hidden Department',
            'slug' => 'hidden-department',
            'is_published' => false,
        ]);

        AcademicProgram::query()->create([
            'title' => 'Published Program',
            'slug' => 'published-program',
            'bullet_points' => ['Lab practice', 'Industry projects'],
            'is_published' => true,
        ]);
        AcademicProgram::query()->create([
            'title' => 'Hidden Program',
            'slug' => 'hidden-program',
            'is_published' => false,
        ]);

        FacultyProfile::query()->create([
            'name' => 'Published Faculty',
            'slug' => 'published-faculty',
            'is_published' => true,
        ]);
        FacultyProfile::query()->create([
            'name' => 'Hidden Faculty',
            'slug' => 'hidden-faculty',
            'is_published' => false,
        ]);

        $this->assertPublishedList('/api/v1/notices', 'published-notice', 'hidden-notice');
        $this->getJson('/api/v1/notices')
            ->assertOk()
            ->assertJsonPath('data.0.featured_image_path', 'cms/notices/images/published.webp')
            ->assertJsonPath('data.0.featured_image_url', 'http://localhost/storage/cms/notices/images/published.webp')
            ->assertJsonPath('data.0.attachment_path', 'cms/notices/attachments/published.pdf')
            ->assertJsonPath('data.0.attachment_url', 'http://localhost/storage/cms/notices/attachments/published.pdf')
            ->assertJsonPath('data.0.content_blocks.0.type', 'image')
            ->assertJsonPath('data.0.content_blocks.0.image_url', 'http://localhost/storage/cms/notices/content/images/published.webp')
            ->assertJsonPath('data.0.external_link', 'https://example.com/published-notice')
            ->assertJsonPath('data.0.video_url', 'https://www.youtube.com/watch?v=example')
            ->assertJsonPath('data.0.is_published', true);
        $this->assertPublishedList('/api/v1/news', 'published-news', 'hidden-news');
        $this->assertPublishedList('/api/v1/events', 'published-event', 'hidden-event');
        $this->assertPublishedList('/api/v1/gallery-albums', 'published-album', 'hidden-album');
        $this->assertPublishedList('/api/v1/downloads', 'published-download', 'hidden-download');
        $this->assertPublishedList('/api/v1/academic-programs', 'published-program', 'hidden-program');
        $this->assertPublishedList('/api/v1/departments', 'published-department', 'hidden-department');
        $this->assertPublishedList('/api/v1/faculty-profiles', 'published-faculty', 'hidden-faculty');
    }

    public function test_detail_apis_return_correct_content_by_slug(): void
    {
        Notice::query()->create([
            'title' => 'Notice Detail',
            'slug' => 'notice-detail',
            'body' => 'Notice body',
            'content_blocks' => [
                [
                    'type' => 'attachment',
                    'title' => 'Routine',
                    'attachment_path' => 'cms/notices/content/attachments/routine.pdf',
                ],
                [
                    'type' => 'video',
                    'title' => 'Briefing',
                    'video_url' => 'https://youtu.be/detail',
                ],
            ],
            'featured_image_path' => 'cms/notices/images/detail.webp',
            'attachment_path' => 'cms/notices/attachments/detail.docx',
            'external_link' => 'https://example.com/detail',
            'video_url' => 'https://www.youtube.com/watch?v=detail',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);

        NewsPost::query()->create([
            'title' => 'News Detail',
            'slug' => 'news-detail',
            'body' => 'News body',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);

        Event::query()->create([
            'title' => 'Event Detail',
            'slug' => 'event-detail',
            'body' => 'Event body',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);

        Department::query()->create([
            'name' => 'Department Detail',
            'slug' => 'department-detail',
            'description' => 'Department body',
            'is_published' => true,
        ]);

        $this->getJson('/api/v1/notices/notice-detail')
            ->assertOk()
            ->assertJsonPath('data.slug', 'notice-detail')
            ->assertJsonPath('data.body', 'Notice body')
            ->assertJsonPath('data.featured_image_path', 'cms/notices/images/detail.webp')
            ->assertJsonPath('data.featured_image_url', 'http://localhost/storage/cms/notices/images/detail.webp')
            ->assertJsonPath('data.attachment_path', 'cms/notices/attachments/detail.docx')
            ->assertJsonPath('data.attachment_url', 'http://localhost/storage/cms/notices/attachments/detail.docx')
            ->assertJsonPath('data.content_blocks.0.attachment_url', 'http://localhost/storage/cms/notices/content/attachments/routine.pdf')
            ->assertJsonPath('data.content_blocks.1.video_url', 'https://youtu.be/detail')
            ->assertJsonPath('data.external_link', 'https://example.com/detail')
            ->assertJsonPath('data.video_url', 'https://www.youtube.com/watch?v=detail');

        $this->getJson('/api/v1/news/news-detail')
            ->assertOk()
            ->assertJsonPath('data.slug', 'news-detail')
            ->assertJsonPath('data.body', 'News body');

        $this->getJson('/api/v1/events/event-detail')
            ->assertOk()
            ->assertJsonPath('data.slug', 'event-detail')
            ->assertJsonPath('data.body', 'Event body');

        $this->getJson('/api/v1/departments/department-detail')
            ->assertOk()
            ->assertJsonPath('data.slug', 'department-detail')
            ->assertJsonPath('data.description', 'Department body');
    }

    public function test_unpublished_detail_content_is_not_exposed(): void
    {
        Notice::query()->create([
            'title' => 'Hidden Notice',
            'slug' => 'hidden-notice-detail',
            'is_published' => false,
        ]);

        NewsPost::query()->create([
            'title' => 'Hidden News',
            'slug' => 'hidden-news-detail',
            'is_published' => false,
        ]);

        Event::query()->create([
            'title' => 'Hidden Event',
            'slug' => 'hidden-event-detail',
            'is_published' => false,
        ]);

        GalleryAlbum::query()->create([
            'title' => 'Hidden Album',
            'slug' => 'hidden-album-detail',
            'is_published' => false,
        ]);

        Department::query()->create([
            'name' => 'Hidden Department',
            'slug' => 'hidden-department-detail',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/notices/hidden-notice-detail')->assertNotFound();
        $this->getJson('/api/v1/news/hidden-news-detail')->assertNotFound();
        $this->getJson('/api/v1/events/hidden-event-detail')->assertNotFound();
        $this->getJson('/api/v1/gallery-albums/hidden-album-detail')->assertNotFound();
        $this->getJson('/api/v1/departments/hidden-department-detail')->assertNotFound();
    }

    public function test_gallery_album_returns_only_published_gallery_items(): void
    {
        $album = GalleryAlbum::query()->create([
            'title' => 'Gallery Album',
            'slug' => 'gallery-album',
            'is_published' => true,
        ]);

        GalleryItem::query()->create([
            'gallery_album_id' => $album->id,
            'title' => 'Visible Item',
            'image_path' => 'cms/gallery/items/visible.jpg',
            'is_published' => true,
        ]);

        GalleryItem::query()->create([
            'gallery_album_id' => $album->id,
            'title' => 'Hidden Item',
            'image_path' => 'cms/gallery/items/hidden.jpg',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/gallery-albums/gallery-album')
            ->assertOk()
            ->assertJsonPath('data.slug', 'gallery-album')
            ->assertJsonPath('data.items.0.title', 'Visible Item')
            ->assertJsonMissing(['title' => 'Hidden Item']);
    }

    public function test_department_detail_includes_published_faculty_profiles(): void
    {
        $department = Department::query()->create([
            'name' => 'Department',
            'slug' => 'department',
            'is_published' => true,
        ]);

        FacultyProfile::query()->create([
            'department_id' => $department->id,
            'name' => 'Visible Faculty',
            'slug' => 'visible-faculty',
            'is_published' => true,
        ]);

        FacultyProfile::query()->create([
            'department_id' => $department->id,
            'name' => 'Hidden Faculty',
            'slug' => 'hidden-faculty',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/departments/department')
            ->assertOk()
            ->assertJsonPath('data.faculty_profiles.0.slug', 'visible-faculty')
            ->assertJsonMissing(['slug' => 'hidden-faculty']);
    }

    private function assertPublishedList(string $uri, string $publishedSlug, string $hiddenSlug): void
    {
        $this->getJson($uri)
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.slug', $publishedSlug)
            ->assertJsonMissing(['slug' => $hiddenSlug])
            ->assertJsonPath('meta.total', 1);
    }
}
