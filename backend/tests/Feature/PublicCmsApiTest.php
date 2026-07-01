<?php

namespace Tests\Feature;

use App\Models\HomepageSection;
use App\Models\HeroFeatureCard;
use App\Models\Menu;
use App\Models\MenuItem;
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
            ->assertJsonPath('data.1.key', 'second-section')
            ->assertJsonMissing(['key' => 'disabled-section']);
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
