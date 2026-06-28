<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Download;
use App\Models\Event;
use App\Models\FacultyProfile;
use App\Models\GalleryAlbum;
use App\Models\GalleryItem;
use App\Models\HomepageSection;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\NewsPost;
use App\Models\Notice;
use App\Models\SiteSetting;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

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
                'metadata' => $section->metadata ?? [],
            ]);

        return $this->publicResponse($sections, 'Homepage sections retrieved.');
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
            ->orderByDesc('is_pinned')
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
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate($this->perPage())
            ->through(fn (NewsPost $post): array => $this->formatNewsPost($post));

        return $this->paginatedResponse($posts, 'News posts retrieved.');
    }

    public function newsPost(string $slug): JsonResponse
    {
        $post = NewsPost::query()->published()->where('slug', $slug)->first();

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
            'body' => $includeBody ? $notice->body : null,
            'category' => $notice->category,
            'audience' => $notice->audience,
            'attachment_path' => $notice->attachment_path,
            'is_pinned' => $notice->is_pinned,
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
