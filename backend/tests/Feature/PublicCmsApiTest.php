<?php

namespace Tests\Feature;

use App\Models\AboutSection;
use App\Models\CampusLifeSection;
use App\Models\ChairmanMessage;
use App\Models\HeroSection;
use App\Models\HomepageSection;
use App\Models\HeroFeatureCard;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\OistLab;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicCmsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_site_settings_api_returns_public_safe_structure(): void
    {
        SiteSetting::query()->create([
            'site_title' => 'Example Campus',
            'meta_description' => 'Public description',
            'email' => 'info@example.edu',
            'logo_path' => 'site-settings/logos/logo.png',
            'is_admission_open' => true,
            'is_popup_notice_enabled' => false,
        ]);

        $response = $this->getJson('/api/v1/site-settings');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.site_title', 'Example Campus')
            ->assertJsonPath('data.email', 'info@example.edu')
            ->assertJsonPath('data.is_admission_open', true)
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.created_at');

        $cacheControl = $response->headers->get('Cache-Control');

        $this->assertStringContainsString('public', $cacheControl);
        $this->assertStringContainsString('max-age=60', $cacheControl);
        $this->assertStringContainsString('stale-while-revalidate=300', $cacheControl);
    }

    public function test_homepage_sections_api_returns_enabled_sections_ordered_by_sort_order(): void
    {
        HomepageSection::query()->create([
            'key' => 'disabled-section',
            'title' => 'Disabled',
            'sort_order' => 1,
            'is_enabled' => false,
        ]);

        HomepageSection::query()->create([
            'key' => 'second-section',
            'title' => 'Second',
            'sort_order' => 20,
            'is_enabled' => true,
        ]);

        HomepageSection::query()->create([
            'key' => 'first-section',
            'title' => 'First',
            'sort_order' => 10,
            'is_enabled' => true,
            'metadata' => [
                'chairman_name' => 'CMS Chairman',
                'chairman_designation' => 'Chairman',
                'signature_image' => 'homepage-sections/signatures/signature.png',
                'quote_label' => 'Message',
                'layout_variant' => 'default',
            ],
        ]);

        $response = $this->getJson('/api/v1/homepage-sections');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.key', 'first-section')
            ->assertJsonPath('data.0.metadata.chairman_name', 'CMS Chairman')
            ->assertJsonPath('data.0.metadata.chairman_designation', 'Chairman')
            ->assertJsonPath('data.0.metadata.signature_image', 'homepage-sections/signatures/signature.png')
            ->assertJsonPath('data.0.metadata.quote_label', 'Message')
            ->assertJsonPath('data.0.metadata.layout_variant', 'default')
            ->assertJsonPath('data.0.is_enabled', true)
            ->assertJsonPath('data.1.key', 'second-section')
            ->assertJsonMissing(['key' => 'disabled-section']);
    }

    public function test_hero_section_api_returns_first_published_hero_section(): void
    {
        HeroSection::query()->create([
            'title' => 'Hidden Hero',
            'sort_order' => 1,
            'is_published' => false,
        ]);

        HeroSection::query()->create([
            'title' => 'Main Hero',
            'subtitle' => 'Admissions Open',
            'content' => 'Hero description.',
            'hero_image_path' => 'cms/hero/main.jpg',
            'video_url' => 'https://example.com/video',
            'button_text' => 'Apply Now',
            'button_url' => '/admission',
            'secondary_button_text' => 'Explore',
            'secondary_button_url' => '/departments',
            'sort_order' => 10,
            'is_published' => true,
        ]);

        $response = $this->getJson('/api/v1/hero-section');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Main Hero')
            ->assertJsonPath('data.hero_image_path', 'cms/hero/main.jpg')
            ->assertJsonMissing(['title' => 'Hidden Hero'])
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.created_at');
    }

    public function test_about_section_api_returns_first_published_about_section(): void
    {
        AboutSection::query()->create([
            'title' => 'About OIST',
            'content' => 'About body.',
            'main_image_path' => 'cms/about/main.jpg',
            'gallery_images' => ['cms/about/gallery-1.jpg'],
            'feature_bullets' => [
                ['title' => 'Practical labs', 'description' => 'Hands-on learning.'],
            ],
            'sort_order' => 1,
            'is_published' => true,
        ]);

        $response = $this->getJson('/api/v1/about-section');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'About OIST')
            ->assertJsonPath('data.gallery_images.0', 'cms/about/gallery-1.jpg')
            ->assertJsonPath('data.feature_bullets.0.title', 'Practical labs')
            ->assertJsonMissingPath('data.id');
    }

    public function test_chairman_message_api_returns_first_published_message(): void
    {
        ChairmanMessage::query()->create([
            'title' => 'Chairman Message',
            'chairman_name' => 'CMS Chairman',
            'chairman_designation' => 'Chairman',
            'message' => 'Public message.',
            'chairman_image_path' => 'cms/chairman-message/photo.jpg',
            'signature_image_path' => 'cms/chairman-message/signature.png',
            'quote_label' => 'Message',
            'sort_order' => 1,
            'is_published' => true,
        ]);

        $response = $this->getJson('/api/v1/chairman-message');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.chairman_name', 'CMS Chairman')
            ->assertJsonPath('data.signature_image_path', 'cms/chairman-message/signature.png')
            ->assertJsonMissingPath('data.id');
    }

    public function test_oist_lab_api_returns_first_published_showcase(): void
    {
        OistLab::query()->create([
            'title' => 'OIST Lab',
            'main_image_path' => 'cms/oist-lab/main.jpg',
            'gallery_images' => ['cms/oist-lab/gallery-1.jpg'],
            'gallery_captions' => ['Main lab', 'Equipment'],
            'sort_order' => 1,
            'is_published' => true,
        ]);

        $response = $this->getJson('/api/v1/oist-lab');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'OIST Lab')
            ->assertJsonPath('data.gallery_images.0', 'cms/oist-lab/gallery-1.jpg')
            ->assertJsonPath('data.gallery_captions.1', 'Equipment')
            ->assertJsonMissingPath('data.id');
    }

    public function test_campus_life_section_api_returns_first_published_section(): void
    {
        CampusLifeSection::query()->create([
            'title' => 'Campus Life',
            'subtitle' => 'Student Experience',
            'description' => 'Campus life description.',
            'image_path' => 'cms/campus-life/main.jpg',
            'gallery_images' => ['cms/campus-life/gallery-1.jpg'],
            'button_text' => 'Explore',
            'button_url' => '/campus-life',
            'sort_order' => 1,
            'is_published' => true,
        ]);

        $response = $this->getJson('/api/v1/campus-life-section');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Campus Life')
            ->assertJsonPath('data.gallery_images.0', 'cms/campus-life/gallery-1.jpg')
            ->assertJsonMissingPath('data.id');
    }

    public function test_hero_feature_cards_api_returns_enabled_cards_ordered_by_sort_order(): void
    {
        HeroFeatureCard::query()->create([
            'title' => 'Disabled Card',
            'description' => 'Hidden from public API.',
            'icon_key' => 'library',
            'style_variant' => 'navy',
            'sort_order' => 1,
            'is_enabled' => false,
        ]);

        HeroFeatureCard::query()->create([
            'title' => 'Second Card',
            'description' => 'Displayed second.',
            'icon_key' => 'educator',
            'style_variant' => 'yellow',
            'sort_order' => 20,
            'is_enabled' => true,
        ]);

        HeroFeatureCard::query()->create([
            'title' => 'First Card',
            'description' => 'Displayed first.',
            'icon_key' => 'achievement',
            'style_variant' => 'navy',
            'sort_order' => 10,
            'is_enabled' => true,
        ]);

        $response = $this->getJson('/api/v1/hero-feature-cards');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.title', 'First Card')
            ->assertJsonPath('data.0.icon_key', 'achievement')
            ->assertJsonPath('data.1.title', 'Second Card')
            ->assertJsonPath('data.1.style_variant', 'yellow')
            ->assertJsonMissing(['title' => 'Disabled Card'])
            ->assertJsonMissingPath('data.0.id')
            ->assertJsonMissingPath('data.0.created_at');
    }

    public function test_menus_api_returns_active_menu_items(): void
    {
        $menu = Menu::query()->create([
            'name' => 'Main Menu',
            'location' => 'header',
            'is_active' => true,
        ]);

        $parent = MenuItem::query()->create([
            'menu_id' => $menu->id,
            'label' => 'About',
            'url' => '/about',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        MenuItem::query()->create([
            'menu_id' => $menu->id,
            'parent_id' => $parent->id,
            'label' => 'Team',
            'url' => '/about/team',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        MenuItem::query()->create([
            'menu_id' => $menu->id,
            'label' => 'Hidden',
            'url' => '/hidden',
            'sort_order' => 5,
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/menus/header');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.location', 'header')
            ->assertJsonPath('data.items.0.label', 'About')
            ->assertJsonPath('data.items.0.children.0.label', 'Team')
            ->assertJsonMissing(['label' => 'Hidden']);
    }

    public function test_menus_api_rejects_unknown_location(): void
    {
        $this->getJson('/api/v1/menus/sidebar')
            ->assertNotFound()
            ->assertJsonPath('success', false)
            ->assertJsonPath('error', 'not_found');
    }
}
