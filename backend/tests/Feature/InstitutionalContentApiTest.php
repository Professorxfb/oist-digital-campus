<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Facility;
use App\Models\FAQ;
use App\Models\InstitutionalPage;
use App\Models\LeadershipProfile;
use App\Models\NewsPost;
use App\Models\Scholarship;
use App\Models\Video;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InstitutionalContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_published_institutional_pages_are_visible_through_api(): void
    {
        InstitutionalPage::query()->create([
            'title' => 'Visible Page',
            'slug' => 'visible-page',
            'page_type' => 'about',
            'body' => 'Visible page body',
            'is_published' => true,
        ]);

        $this->getJson('/api/v1/institutional-pages')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'visible-page')
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/v1/institutional-pages/visible-page')
            ->assertOk()
            ->assertJsonPath('data.body', 'Visible page body');
    }

    public function test_unpublished_institutional_pages_are_hidden(): void
    {
        InstitutionalPage::query()->create([
            'title' => 'Hidden Page',
            'slug' => 'hidden-page',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/institutional-pages')
            ->assertOk()
            ->assertJsonMissing(['slug' => 'hidden-page'])
            ->assertJsonPath('meta.total', 0);

        $this->getJson('/api/v1/institutional-pages/hidden-page')->assertNotFound();
    }

    public function test_scholarships_api_returns_only_published_scholarships(): void
    {
        Scholarship::query()->create([
            'title' => 'Visible Scholarship',
            'slug' => 'visible-scholarship',
            'is_published' => true,
        ]);

        Scholarship::query()->create([
            'title' => 'Hidden Scholarship',
            'slug' => 'hidden-scholarship',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/scholarships')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'visible-scholarship')
            ->assertJsonMissing(['slug' => 'hidden-scholarship'])
            ->assertJsonPath('meta.total', 1);
    }

    public function test_facilities_api_returns_only_published_facilities(): void
    {
        Facility::query()->create([
            'title' => 'Visible Facility',
            'slug' => 'visible-facility',
            'is_published' => true,
        ]);

        Facility::query()->create([
            'title' => 'Hidden Facility',
            'slug' => 'hidden-facility',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/facilities')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'visible-facility')
            ->assertJsonMissing(['slug' => 'hidden-facility'])
            ->assertJsonPath('meta.total', 1);
    }

    public function test_faqs_api_returns_only_published_faqs(): void
    {
        FAQ::query()->create([
            'question' => 'Visible Question',
            'answer' => 'Visible answer',
            'is_published' => true,
        ]);

        FAQ::query()->create([
            'question' => 'Hidden Question',
            'answer' => 'Hidden answer',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/faqs')
            ->assertOk()
            ->assertJsonPath('data.0.question', 'Visible Question')
            ->assertJsonMissing(['question' => 'Hidden Question']);
    }

    public function test_leadership_profiles_api_returns_only_published_profiles(): void
    {
        LeadershipProfile::query()->create([
            'name' => 'Visible Leader',
            'slug' => 'visible-leader',
            'is_published' => true,
        ]);

        LeadershipProfile::query()->create([
            'name' => 'Hidden Leader',
            'slug' => 'hidden-leader',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/leadership-profiles')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'visible-leader')
            ->assertJsonMissing(['slug' => 'hidden-leader'])
            ->assertJsonPath('meta.total', 1);
    }

    public function test_videos_api_returns_only_published_videos(): void
    {
        Video::query()->create([
            'title' => 'Visible Video',
            'slug' => 'visible-video',
            'video_type' => 'youtube',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);

        Video::query()->create([
            'title' => 'Hidden Video',
            'slug' => 'hidden-video',
            'video_type' => 'youtube',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/videos')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'visible-video')
            ->assertJsonMissing(['slug' => 'hidden-video'])
            ->assertJsonPath('meta.total', 1);
    }

    public function test_video_detail_api_returns_404_for_missing_or_unpublished_content(): void
    {
        Video::query()->create([
            'title' => 'Hidden Video',
            'slug' => 'hidden-video-detail',
            'video_type' => 'youtube',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/videos/missing-video')->assertNotFound();
        $this->getJson('/api/v1/videos/hidden-video-detail')->assertNotFound();
    }

    public function test_public_search_returns_only_published_content(): void
    {
        InstitutionalPage::query()->create([
            'title' => 'Robotics Lab',
            'slug' => 'robotics-lab',
            'body' => 'SharedSearchKeyword visible',
            'is_published' => true,
        ]);

        Scholarship::query()->create([
            'title' => 'Hidden Scholarship',
            'slug' => 'hidden-scholarship-search',
            'summary' => 'SharedSearchKeyword hidden',
            'is_published' => false,
        ]);

        Video::query()->create([
            'title' => 'Workshop Video',
            'slug' => 'workshop-video',
            'excerpt' => 'SharedSearchKeyword video',
            'video_type' => 'youtube',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);

        $this->getJson('/api/v1/search?q=SharedSearchKeyword')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonFragment(['type' => 'institutional_page'])
            ->assertJsonFragment(['type' => 'video'])
            ->assertJsonMissing(['slug' => 'hidden-scholarship-search'])
            ->assertJsonMissing(['title' => 'Hidden Scholarship']);
    }

    public function test_public_search_returns_empty_results_for_short_query(): void
    {
        InstitutionalPage::query()->create([
            'title' => 'Visible Page',
            'slug' => 'visible-short-query-page',
            'is_published' => true,
        ]);

        $this->getJson('/api/v1/search?q=a')
            ->assertOk()
            ->assertJsonPath('data', []);
    }

    public function test_related_news_with_department_id_does_not_break_existing_news_api(): void
    {
        $department = Department::query()->create([
            'name' => 'Related Department',
            'slug' => 'related-department',
            'is_published' => true,
        ]);

        NewsPost::query()->create([
            'department_id' => $department->id,
            'title' => 'Department News',
            'slug' => 'department-news',
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);

        $this->getJson('/api/v1/news')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'department-news')
            ->assertJsonPath('data.0.department.slug', 'related-department');
    }
}
