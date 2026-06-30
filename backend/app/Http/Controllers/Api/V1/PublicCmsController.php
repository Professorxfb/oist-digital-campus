<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicProgram;
use App\Models\Department;
use App\Models\Download;
use App\Models\Event;
use App\Models\Facility;
use App\Models\FAQ;
use App\Models\FacultyProfile;
use App\Models\GalleryAlbum;
use App\Models\GalleryItem;
use App\Models\HeroFeatureCard;
use App\Models\HomepageSection;
use App\Models\InstitutionalPage;
use App\Models\LeadershipProfile;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\NewsPost;
use App\Models\Notice;
use App\Models\Scholarship;
use App\Models\SiteSetting;
use App\Models\Video;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PublicCmsController extends Controller
{
    public function siteSettings(): JsonResponse
    {
        $settings = SiteSetting::query()->first();

        return $this->publicResponse([
            'institute_name' => $settings?->institute_name,
            'site_title' => $settings?->site_title,
            'site_tagline' => $settings?->site_tagline,
            'meta_title' => $settings?->meta_title,
            'meta_description' => $settings?->meta_description,
            'logo_path' => $settings?->logo_path,
            'dark_logo_path' => $settings?->dark_logo_path,
            'favicon_path' => $settings?->favicon_path,
            'primary_phone' => $settings?->primary_phone,
            'secondary_phone' => $settings?->secondary_phone,
            'email' => $settings?->email,
            'address' => $settings?->address,
            'google_map_url' => $settings?->google_map_url,
            'facebook_url' => $settings?->facebook_url,
            'youtube_url' => $settings?->youtube_url,
            'linkedin_url' => $settings?->linkedin_url,
            'whatsapp_number' => $settings?->whatsapp_number,
            'footer_text' => $settings?->footer_text,
            'admission_cta_text' => $settings?->admission_cta_text,
            'admission_cta_url' => $settings?->admission_cta_url,
            'is_admission_open' => (bool) ($settings?->is_admission_open ?? false),
            'popup_notice_title' => $settings?->popup_notice_title,
            'popup_notice_body' => $settings?->popup_notice_body,
            'is_popup_notice_enabled' => (bool) ($settings?->is_popup_notice_enabled ?? false),
        ], 'Site settings retrieved.');
    }

    public function homepageSections(): JsonResponse
    {
        $sections = HomepageSection::query()
            ->enabled()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (HomepageSection $section): array => [
                'key' => $section->key,
                'title' => $section->title,
                'subtitle' => $section->subtitle,
                'content' => $section->content,
                'image_path' => $section->image_path,
                'video_path' => $section->video_path,
                'button_text' => $section->button_text,
                'button_url' => $section->button_url,
                'sort_order' => $section->sort_order,
                'metadata' => (object) ($section->metadata ?? []),
            ]);

        return $this->publicResponse($sections, 'Homepage sections retrieved.');
    }

    public function heroFeatureCards(): JsonResponse
    {
        $cards = HeroFeatureCard::query()
            ->enabled()
            ->ordered()
            ->limit(3)
            ->get()
            ->map(fn (HeroFeatureCard $card): array => [
                'title' => $card->title,
                'description' => $card->description,
                'icon_key' => $card->icon_key,
                'image_path' => $card->image_path,
                'style_variant' => $card->style_variant,
                'button_text' => $card->button_text,
                'button_url' => $card->button_url,
                'sort_order' => $card->sort_order,
            ]);

        return $this->publicResponse($cards, 'Hero feature cards retrieved.');
    }

    public function menu(string $location): JsonResponse
    {
        if (! array_key_exists($location, Menu::LOCATIONS)) {
            return $this->errorResponse('Menu location not found.', 404, 'not_found');
        }

        $menu = Menu::query()
            ->active()
            ->where('location', $location)
            ->with(['activeRootItems.activeChildren'])
            ->orderBy('id')
            ->first();

        return $this->publicResponse([
            'location' => $location,
            'items' => $menu?->activeRootItems
                ->map(fn (MenuItem $item): array => $this->formatMenuItem($item))
                ->values()
                ->all() ?? [],
        ], 'Menu retrieved.');
    }

    public function notices(): JsonResponse
    {
        $notices = Notice::query()
            ->published()
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate($this->perPage())
            ->through(fn (Notice $notice): array => $this->formatNotice($notice));

        return $this->paginatedResponse($notices, 'Notices retrieved.');
    }

    public function notice(string $slug): JsonResponse
    {
        $notice = Notice::query()->published()->where('slug', $slug)->first();

        if (! $notice) {
            return $this->errorResponse('Notice not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatNotice($notice, true), 'Notice retrieved.');
    }

    public function news(): JsonResponse
    {
        $posts = NewsPost::query()
            ->published()
            ->with('department')
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate($this->perPage())
            ->through(fn (NewsPost $post): array => $this->formatNewsPost($post));

        return $this->paginatedResponse($posts, 'News posts retrieved.');
    }

    public function newsPost(string $slug): JsonResponse
    {
        $post = NewsPost::query()->published()->with('department')->where('slug', $slug)->first();

        if (! $post) {
            return $this->errorResponse('News post not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatNewsPost($post, true), 'News post retrieved.');
    }

    public function events(): JsonResponse
    {
        $events = Event::query()
            ->published()
            ->orderByDesc('is_featured')
            ->orderByDesc('event_date')
            ->orderByDesc('id')
            ->paginate($this->perPage())
            ->through(fn (Event $event): array => $this->formatEvent($event));

        return $this->paginatedResponse($events, 'Events retrieved.');
    }

    public function event(string $slug): JsonResponse
    {
        $event = Event::query()->published()->where('slug', $slug)->first();

        if (! $event) {
            return $this->errorResponse('Event not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatEvent($event, true), 'Event retrieved.');
    }

    public function galleryAlbums(): JsonResponse
    {
        $albums = GalleryAlbum::query()
            ->published()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate($this->perPage())
            ->through(fn (GalleryAlbum $album): array => $this->formatGalleryAlbum($album));

        return $this->paginatedResponse($albums, 'Gallery albums retrieved.');
    }

    public function galleryAlbum(string $slug): JsonResponse
    {
        $album = GalleryAlbum::query()
            ->published()
            ->with('publishedItems')
            ->where('slug', $slug)
            ->first();

        if (! $album) {
            return $this->errorResponse('Gallery album not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatGalleryAlbum($album, true), 'Gallery album retrieved.');
    }

    public function downloads(): JsonResponse
    {
        $downloads = Download::query()
            ->published()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate($this->perPage())
            ->through(fn (Download $download): array => $this->formatDownload($download));

        return $this->paginatedResponse($downloads, 'Downloads retrieved.');
    }

    public function departments(): JsonResponse
    {
        $departments = Department::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate($this->perPage())
            ->through(fn (Department $department): array => $this->formatDepartment($department));

        return $this->paginatedResponse($departments, 'Departments retrieved.');
    }

    public function academicPrograms(): JsonResponse
    {
        $programs = AcademicProgram::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('title')
            ->paginate($this->perPage())
            ->through(fn (AcademicProgram $program): array => $this->formatAcademicProgram($program));

        return $this->paginatedResponse($programs, 'Academic programs retrieved.');
    }

    public function department(string $slug): JsonResponse
    {
        $department = Department::query()
            ->published()
            ->with('publishedFacultyProfiles')
            ->where('slug', $slug)
            ->first();

        if (! $department) {
            return $this->errorResponse('Department not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatDepartment($department, true), 'Department retrieved.');
    }

    public function facultyProfiles(): JsonResponse
    {
        $profiles = FacultyProfile::query()
            ->published()
            ->with('department')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate($this->perPage())
            ->through(fn (FacultyProfile $profile): array => $this->formatFacultyProfile($profile, true));

        return $this->paginatedResponse($profiles, 'Faculty profiles retrieved.');
    }

    public function institutionalPages(): JsonResponse
    {
        $pages = InstitutionalPage::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('title')
            ->paginate($this->perPage())
            ->through(fn (InstitutionalPage $page): array => $this->formatInstitutionalPage($page));

        return $this->paginatedResponse($pages, 'Institutional pages retrieved.');
    }

    public function institutionalPage(string $slug): JsonResponse
    {
        $page = InstitutionalPage::query()->published()->where('slug', $slug)->first();

        if (! $page) {
            return $this->errorResponse('Institutional page not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatInstitutionalPage($page, true), 'Institutional page retrieved.');
    }

    public function scholarships(): JsonResponse
    {
        $scholarships = Scholarship::query()
            ->published()
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderBy('deadline')
            ->orderByDesc('id')
            ->paginate($this->perPage())
            ->through(fn (Scholarship $scholarship): array => $this->formatScholarship($scholarship));

        return $this->paginatedResponse($scholarships, 'Scholarships retrieved.');
    }

    public function scholarship(string $slug): JsonResponse
    {
        $scholarship = Scholarship::query()->published()->where('slug', $slug)->first();

        if (! $scholarship) {
            return $this->errorResponse('Scholarship not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatScholarship($scholarship, true), 'Scholarship retrieved.');
    }

    public function facilities(): JsonResponse
    {
        $facilities = Facility::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('title')
            ->paginate($this->perPage())
            ->through(fn (Facility $facility): array => $this->formatFacility($facility));

        return $this->paginatedResponse($facilities, 'Facilities retrieved.');
    }

    public function facility(string $slug): JsonResponse
    {
        $facility = Facility::query()->published()->where('slug', $slug)->first();

        if (! $facility) {
            return $this->errorResponse('Facility not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatFacility($facility, true), 'Facility retrieved.');
    }

    public function faqs(): JsonResponse
    {
        $faqs = FAQ::query()
            ->published()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (FAQ $faq): array => $this->formatFAQ($faq))
            ->values();

        return $this->publicResponse($faqs, 'FAQs retrieved.');
    }

    public function leadershipProfiles(): JsonResponse
    {
        $profiles = LeadershipProfile::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate($this->perPage())
            ->through(fn (LeadershipProfile $profile): array => $this->formatLeadershipProfile($profile));

        return $this->paginatedResponse($profiles, 'Leadership profiles retrieved.');
    }

    public function leadershipProfile(string $slug): JsonResponse
    {
        $profile = LeadershipProfile::query()->published()->where('slug', $slug)->first();

        if (! $profile) {
            return $this->errorResponse('Leadership profile not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatLeadershipProfile($profile, true), 'Leadership profile retrieved.');
    }

    public function videos(): JsonResponse
    {
        $videos = Video::query()
            ->published()
            ->when(request()->filled('category'), fn ($query) => $query->where('category', request()->string('category')->toString()))
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->orderByDesc('event_date')
            ->orderByDesc('id')
            ->paginate($this->perPage())
            ->through(fn (Video $video): array => $this->formatVideo($video));

        return $this->paginatedResponse($videos, 'Videos retrieved.');
    }

    public function video(string $slug): JsonResponse
    {
        $video = Video::query()->published()->where('slug', $slug)->first();

        if (! $video) {
            return $this->errorResponse('Video not found.', 404, 'not_found');
        }

        return $this->publicResponse($this->formatVideo($video, true), 'Video retrieved.');
    }

    public function search(): JsonResponse
    {
        $query = trim(request()->string('q')->toString());

        if (mb_strlen($query) < 2) {
            return $this->publicResponse([], 'Search results retrieved.');
        }

        $term = '%' . str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $query) . '%';
        $limit = min(max(request()->integer('limit', 5), 1), 10);
        $results = collect();

        $results = $results->merge(Notice::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('body', 'like', $term)
                ->orWhere('category', 'like', $term))
            ->latest('published_at')
            ->limit($limit)
            ->get()
            ->map(fn (Notice $notice): array => $this->searchResult('notice', $notice->title, $notice->body, "/notices/{$notice->slug}", $notice->published_at ?? $notice->updated_at)));

        $results = $results->merge(NewsPost::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('excerpt', 'like', $term)
                ->orWhere('body', 'like', $term)
                ->orWhere('category', 'like', $term))
            ->latest('published_at')
            ->limit($limit)
            ->get()
            ->map(fn (NewsPost $post): array => $this->searchResult('news', $post->title, $post->excerpt ?? $post->body, "/news/{$post->slug}", $post->published_at ?? $post->updated_at)));

        $results = $results->merge(Event::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('excerpt', 'like', $term)
                ->orWhere('body', 'like', $term)
                ->orWhere('location', 'like', $term))
            ->latest('event_date')
            ->limit($limit)
            ->get()
            ->map(fn (Event $event): array => $this->searchResult('event', $event->title, $event->excerpt ?? $event->body, "/events/{$event->slug}", $event->published_at ?? $event->updated_at)));

        $results = $results->merge(Department::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('name', 'like', $term)
                ->orWhere('short_description', 'like', $term)
                ->orWhere('description', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (Department $department): array => $this->searchResult('department', $department->name, $department->short_description ?? $department->description, "/departments/{$department->slug}", $department->updated_at)));

        $results = $results->merge(AcademicProgram::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('category', 'like', $term)
                ->orWhere('short_description', 'like', $term)
                ->orWhere('description', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (AcademicProgram $program): array => $this->searchResult('academic_program', $program->title, $program->short_description ?? $program->description, $program->button_url ?? '/', $program->updated_at)));

        $results = $results->merge(FacultyProfile::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('name', 'like', $term)
                ->orWhere('designation', 'like', $term)
                ->orWhere('short_bio', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (FacultyProfile $profile): array => $this->searchResult('faculty_profile', $profile->name, $profile->designation ?? $profile->short_bio, '/faculty', $profile->updated_at)));

        $results = $results->merge(Download::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('description', 'like', $term)
                ->orWhere('category', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (Download $download): array => $this->searchResult('download', $download->title, $download->description, '/downloads', $download->updated_at)));

        $results = $results->merge(GalleryAlbum::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('description', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (GalleryAlbum $album): array => $this->searchResult('gallery_album', $album->title, $album->description, "/gallery/{$album->slug}", $album->updated_at)));

        $results = $results->merge(InstitutionalPage::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('excerpt', 'like', $term)
                ->orWhere('body', 'like', $term)
                ->orWhere('page_type', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (InstitutionalPage $page): array => $this->searchResult('institutional_page', $page->title, $page->excerpt ?? $page->body, "/institutional-pages/{$page->slug}", $page->updated_at)));

        $results = $results->merge(Scholarship::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('summary', 'like', $term)
                ->orWhere('description', 'like', $term)
                ->orWhere('eligibility', 'like', $term))
            ->orderByDesc('is_featured')
            ->limit($limit)
            ->get()
            ->map(fn (Scholarship $scholarship): array => $this->searchResult('scholarship', $scholarship->title, $scholarship->summary ?? $scholarship->description, "/scholarships/{$scholarship->slug}", $scholarship->updated_at)));

        $results = $results->merge(Facility::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('summary', 'like', $term)
                ->orWhere('description', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (Facility $facility): array => $this->searchResult('facility', $facility->title, $facility->summary ?? $facility->description, "/facilities/{$facility->slug}", $facility->updated_at)));

        $results = $results->merge(FAQ::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('question', 'like', $term)
                ->orWhere('answer', 'like', $term)
                ->orWhere('category', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (FAQ $faq): array => $this->searchResult('faq', $faq->question, $faq->answer, '/faqs', $faq->updated_at)));

        $results = $results->merge(LeadershipProfile::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('name', 'like', $term)
                ->orWhere('designation', 'like', $term)
                ->orWhere('short_bio', 'like', $term)
                ->orWhere('message', 'like', $term))
            ->orderBy('sort_order')
            ->limit($limit)
            ->get()
            ->map(fn (LeadershipProfile $profile): array => $this->searchResult('leadership_profile', $profile->name, $profile->designation ?? $profile->short_bio, "/leadership-profiles/{$profile->slug}", $profile->updated_at)));

        $results = $results->merge(Video::query()
            ->published()
            ->where(fn ($builder) => $builder
                ->where('title', 'like', $term)
                ->orWhere('excerpt', 'like', $term)
                ->orWhere('description', 'like', $term)
                ->orWhere('category', 'like', $term))
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get()
            ->map(fn (Video $video): array => $this->searchResult('video', $video->title, $video->excerpt ?? $video->description, "/videos/{$video->slug}", $video->published_at ?? $video->updated_at)));

        return $this->publicResponse($results->values(), 'Search results retrieved.');
    }

    private function formatMenuItem(MenuItem $item): array
    {
        return [
            'label' => $item->label,
            'url' => $item->url,
            'target' => $item->target,
            'sort_order' => $item->sort_order,
            'children' => $item->activeChildren
                ->map(fn (MenuItem $child): array => $this->formatMenuItem($child))
                ->values()
                ->all(),
        ];
    }

    private function formatNotice(Notice $notice, bool $includeBody = false): array
    {
        return array_filter([
            'title' => $notice->title,
            'slug' => $notice->slug,
            'excerpt' => $this->plainText($notice->body),
            'body' => $includeBody ? $notice->body : null,
            'featured_image_path' => $notice->featured_image_path,
            'category' => $notice->category,
            'audience' => $notice->audience,
            'attachment_path' => $notice->attachment_path,
            'external_link' => $notice->external_link,
            'video_url' => $notice->video_url,
            'is_pinned' => $notice->is_pinned,
            'is_published' => $notice->is_published,
            'published_at' => $notice->published_at?->toISOString(),
            'expires_at' => $notice->expires_at?->toISOString(),
            'sort_order' => $notice->sort_order,
            'meta_title' => $notice->meta_title,
            'meta_description' => $notice->meta_description,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatNewsPost(NewsPost $post, bool $includeBody = false): array
    {
        return array_filter([
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'body' => $includeBody ? $post->body : null,
            'featured_image_path' => $post->featured_image_path,
            'category' => $post->category,
            'department' => $post->department
                ? [
                    'name' => $post->department->name,
                    'slug' => $post->department->slug,
                ]
                : null,
            'tags' => $post->tags ?? [],
            'author_name' => $post->author_name,
            'is_featured' => $post->is_featured,
            'published_at' => $post->published_at?->toISOString(),
            'meta_title' => $post->meta_title,
            'meta_description' => $post->meta_description,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatEvent(Event $event, bool $includeBody = false): array
    {
        return array_filter([
            'title' => $event->title,
            'slug' => $event->slug,
            'excerpt' => $event->excerpt,
            'body' => $includeBody ? $event->body : null,
            'featured_image_path' => $event->featured_image_path,
            'location' => $event->location,
            'event_date' => $event->event_date?->toDateString(),
            'start_time' => $event->start_time?->format('H:i'),
            'end_time' => $event->end_time?->format('H:i'),
            'registration_url' => $event->registration_url,
            'is_featured' => $event->is_featured,
            'published_at' => $event->published_at?->toISOString(),
            'meta_title' => $event->meta_title,
            'meta_description' => $event->meta_description,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatGalleryAlbum(GalleryAlbum $album, bool $includeItems = false): array
    {
        return array_filter([
            'title' => $album->title,
            'slug' => $album->slug,
            'description' => $album->description,
            'cover_image_path' => $album->cover_image_path,
            'sort_order' => $album->sort_order,
            'items' => $includeItems
                ? $album->publishedItems
                    ->map(fn (GalleryItem $item): array => $this->formatGalleryItem($item))
                    ->values()
                    ->all()
                : null,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatGalleryItem(GalleryItem $item): array
    {
        return array_filter([
            'title' => $item->title,
            'image_path' => $item->image_path,
            'caption' => $item->caption,
            'sort_order' => $item->sort_order,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatDownload(Download $download): array
    {
        return array_filter([
            'title' => $download->title,
            'slug' => $download->slug,
            'description' => $download->description,
            'file_path' => $download->file_path,
            'category' => $download->category,
            'sort_order' => $download->sort_order,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatDepartment(Department $department, bool $includeFaculty = false): array
    {
        return array_filter([
            'name' => $department->name,
            'slug' => $department->slug,
            'short_description' => $department->short_description,
            'description' => $department->description,
            'featured_image_path' => $department->featured_image_path,
            'icon' => $department->icon,
            'sort_order' => $department->sort_order,
            'meta_title' => $department->meta_title,
            'meta_description' => $department->meta_description,
            'faculty_profiles' => $includeFaculty
                ? $department->publishedFacultyProfiles
                    ->map(fn (FacultyProfile $profile): array => $this->formatFacultyProfile($profile))
                    ->values()
                    ->all()
                : null,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatAcademicProgram(AcademicProgram $program): array
    {
        return array_filter([
            'title' => $program->title,
            'slug' => $program->slug,
            'category' => $program->category,
            'short_description' => $program->short_description,
            'description' => $program->description,
            'featured_image_path' => $program->featured_image_path,
            'icon' => $program->icon,
            'bullet_points' => $program->bullet_points ?? [],
            'button_text' => $program->button_text,
            'button_url' => $program->button_url,
            'sort_order' => $program->sort_order,
            'meta_title' => $program->meta_title,
            'meta_description' => $program->meta_description,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatFacultyProfile(FacultyProfile $profile, bool $includeDepartment = false): array
    {
        return array_filter([
            'name' => $profile->name,
            'slug' => $profile->slug,
            'designation' => $profile->designation,
            'department' => $includeDepartment && $profile->department
                ? [
                    'name' => $profile->department->name,
                    'slug' => $profile->department->slug,
                ]
                : null,
            'photo_path' => $profile->photo_path,
            'short_bio' => $profile->short_bio,
            'email' => $profile->email,
            'phone' => $profile->phone,
            'sort_order' => $profile->sort_order,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatInstitutionalPage(InstitutionalPage $page, bool $includeBody = false): array
    {
        return array_filter([
            'title' => $page->title,
            'slug' => $page->slug,
            'page_type' => $page->page_type,
            'excerpt' => $page->excerpt,
            'body' => $includeBody ? $page->body : null,
            'featured_image_path' => $page->featured_image_path,
            'sort_order' => $page->sort_order,
            'meta_title' => $page->meta_title,
            'meta_description' => $page->meta_description,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatScholarship(Scholarship $scholarship, bool $includeDetails = false): array
    {
        return array_filter([
            'title' => $scholarship->title,
            'slug' => $scholarship->slug,
            'summary' => $scholarship->summary,
            'description' => $includeDetails ? $scholarship->description : null,
            'eligibility' => $includeDetails ? $scholarship->eligibility : null,
            'benefits' => $includeDetails ? $scholarship->benefits : null,
            'application_process' => $includeDetails ? $scholarship->application_process : null,
            'deadline' => $scholarship->deadline?->toDateString(),
            'attachment_path' => $scholarship->attachment_path,
            'is_featured' => $scholarship->is_featured,
            'sort_order' => $scholarship->sort_order,
            'meta_title' => $scholarship->meta_title,
            'meta_description' => $scholarship->meta_description,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatFacility(Facility $facility, bool $includeDescription = false): array
    {
        return array_filter([
            'title' => $facility->title,
            'slug' => $facility->slug,
            'summary' => $facility->summary,
            'description' => $includeDescription ? $facility->description : null,
            'image_path' => $facility->image_path,
            'icon' => $facility->icon,
            'sort_order' => $facility->sort_order,
            'meta_title' => $facility->meta_title,
            'meta_description' => $facility->meta_description,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatFAQ(FAQ $faq): array
    {
        return array_filter([
            'question' => $faq->question,
            'answer' => $faq->answer,
            'category' => $faq->category,
            'sort_order' => $faq->sort_order,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatLeadershipProfile(LeadershipProfile $profile, bool $includeMessage = false): array
    {
        return array_filter([
            'name' => $profile->name,
            'slug' => $profile->slug,
            'designation' => $profile->designation,
            'message' => $includeMessage ? $profile->message : null,
            'short_bio' => $profile->short_bio,
            'photo_path' => $profile->photo_path,
            'email' => $profile->email,
            'phone' => $profile->phone,
            'sort_order' => $profile->sort_order,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function formatVideo(Video $video, bool $includeDescription = false): array
    {
        return array_filter([
            'title' => $video->title,
            'slug' => $video->slug,
            'excerpt' => $video->excerpt,
            'description' => $includeDescription ? $video->description : null,
            'video_type' => $video->video_type,
            'video_url' => $video->video_url,
            'embed_url' => $video->embed_url,
            'thumbnail_path' => $video->thumbnail_path,
            'category' => $video->category,
            'tags' => $video->tags ?? [],
            'event_date' => $video->event_date?->toDateString(),
            'is_featured' => $video->is_featured,
            'published_at' => $video->published_at?->toISOString(),
            'sort_order' => $video->sort_order,
            'meta_title' => $video->meta_title,
            'meta_description' => $video->meta_description,
        ], fn (mixed $value): bool => $value !== null);
    }

    private function searchResult(string $type, string $title, ?string $excerpt, string $url, mixed $date): array
    {
        return array_filter([
            'type' => $type,
            'title' => $title,
            'excerpt' => $this->plainText($excerpt),
            'url' => $url,
            'published_at' => $date?->toISOString(),
        ], fn (mixed $value): bool => $value !== null);
    }

    private function plainText(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        return Str::limit(trim(preg_replace('/\s+/', ' ', strip_tags($value))), 160);
    }

    private function paginatedResponse(LengthAwarePaginator $paginator, string $message): JsonResponse
    {
        return response()
            ->json([
                'success' => true,
                'message' => $message,
                'data' => $paginator->items(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ],
            ])
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    private function publicResponse(mixed $data, string $message): JsonResponse
    {
        return response()
            ->json([
                'success' => true,
                'message' => $message,
                'data' => $data,
                'meta' => [],
            ])
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    private function perPage(): int
    {
        return min(max(request()->integer('per_page', 10), 1), 50);
    }

    private function errorResponse(string $message, int $status, string $error): JsonResponse
    {
        return response()
            ->json([
                'success' => false,
                'message' => $message,
                'error' => $error,
                'errors' => [],
                'meta' => [],
            ], $status)
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }
}
