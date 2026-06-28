<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\SiteSetting;
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
