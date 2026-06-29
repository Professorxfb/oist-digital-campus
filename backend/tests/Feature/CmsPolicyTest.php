<?php

namespace Tests\Feature;

use App\Models\HomepageSection;
use App\Models\HeroFeatureCard;
use App\Models\Facility;
use App\Models\FAQ;
use App\Models\InstitutionalPage;
use App\Models\LeadershipProfile;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Scholarship;
use App\Models\SiteSetting;
use App\Models\User;
use App\Models\Video;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class CmsPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_user_cannot_manage_site_settings(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('teacher');

        $setting = SiteSetting::query()->create();

        $this->assertFalse(Gate::forUser($user)->allows('viewAny', SiteSetting::class));
        $this->assertFalse(Gate::forUser($user)->allows('update', $setting));
    }

    public function test_super_admin_and_admin_can_manage_site_settings(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $setting = SiteSetting::query()->create();

        foreach (['super_admin', 'admin'] as $role) {
            $user = User::factory()->create();
            $user->assignRole($role);

            $this->assertTrue(Gate::forUser($user)->allows('viewAny', SiteSetting::class));
            $this->assertTrue(Gate::forUser($user)->allows('update', $setting));
        }
    }

    public function test_cms_editor_can_manage_homepage_sections_and_menus_but_not_site_settings(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('cms_editor');

        $section = HomepageSection::query()->create([
            'key' => 'editable-section',
        ]);

        $card = HeroFeatureCard::query()->create([
            'title' => 'Editable card',
        ]);

        $menu = Menu::query()->create([
            'name' => 'Footer',
            'location' => 'footer',
        ]);

        $menuItem = MenuItem::query()->create([
            'menu_id' => $menu->id,
            'label' => 'Contact',
            'url' => '/contact',
        ]);

        $this->assertTrue(Gate::forUser($user)->allows('update', $section));
        $this->assertTrue(Gate::forUser($user)->allows('update', $card));
        $this->assertTrue(Gate::forUser($user)->allows('update', $menu));
        $this->assertTrue(Gate::forUser($user)->allows('update', $menuItem));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', SiteSetting::class));
    }

    public function test_non_cms_role_cannot_manage_homepage_sections_or_menus(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('teacher');

        $section = HomepageSection::query()->create([
            'key' => 'locked-section',
        ]);

        $card = HeroFeatureCard::query()->create([
            'title' => 'Locked card',
        ]);

        $menu = Menu::query()->create([
            'name' => 'Header',
            'location' => 'header',
        ]);

        $menuItem = MenuItem::query()->create([
            'menu_id' => $menu->id,
            'label' => 'Home',
            'url' => '/',
        ]);

        $this->assertFalse(Gate::forUser($user)->allows('update', $section));
        $this->assertFalse(Gate::forUser($user)->allows('update', $card));
        $this->assertFalse(Gate::forUser($user)->allows('update', $menu));
        $this->assertFalse(Gate::forUser($user)->allows('update', $menuItem));
    }

    public function test_hero_feature_card_creation_is_limited_to_three_cards(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('admin');

        foreach (range(1, 3) as $index) {
            HeroFeatureCard::query()->create([
                'title' => "Card {$index}",
                'sort_order' => $index,
            ]);
        }

        $this->assertFalse(Gate::forUser($user)->allows('create', HeroFeatureCard::class));
    }

    public function test_institutional_cms_roles_can_manage_new_public_content_modules(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $page = InstitutionalPage::query()->create(['title' => 'Page', 'slug' => 'page']);
        $scholarship = Scholarship::query()->create(['title' => 'Scholarship', 'slug' => 'scholarship']);
        $facility = Facility::query()->create(['title' => 'Facility', 'slug' => 'facility']);
        $faq = FAQ::query()->create(['question' => 'Question', 'answer' => 'Answer']);
        $video = Video::query()->create(['title' => 'Video', 'slug' => 'video']);

        foreach (['super_admin', 'admin', 'cms_editor', 'academic_officer'] as $role) {
            $user = User::factory()->create();
            $user->assignRole($role);

            $this->assertTrue(Gate::forUser($user)->allows('update', $page));
            $this->assertTrue(Gate::forUser($user)->allows('update', $scholarship));
            $this->assertTrue(Gate::forUser($user)->allows('update', $facility));
            $this->assertTrue(Gate::forUser($user)->allows('update', $faq));
            $this->assertTrue(Gate::forUser($user)->allows('update', $video));
        }
    }

    public function test_leadership_profiles_are_limited_to_public_cms_roles(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $profile = LeadershipProfile::query()->create([
            'name' => 'Leader',
            'slug' => 'leader',
        ]);

        foreach (['super_admin', 'admin', 'cms_editor'] as $role) {
            $user = User::factory()->create();
            $user->assignRole($role);

            $this->assertTrue(Gate::forUser($user)->allows('update', $profile));
        }

        $academicOfficer = User::factory()->create();
        $academicOfficer->assignRole('academic_officer');

        $teacher = User::factory()->create();
        $teacher->assignRole('teacher');

        $this->assertFalse(Gate::forUser($academicOfficer)->allows('update', $profile));
        $this->assertFalse(Gate::forUser($teacher)->allows('update', $profile));
    }
}
