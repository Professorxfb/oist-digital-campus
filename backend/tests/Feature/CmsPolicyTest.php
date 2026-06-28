<?php

namespace Tests\Feature;

use App\Models\HomepageSection;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\SiteSetting;
use App\Models\User;
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
        $this->assertFalse(Gate::forUser($user)->allows('update', $menu));
        $this->assertFalse(Gate::forUser($user)->allows('update', $menuItem));
    }
}
