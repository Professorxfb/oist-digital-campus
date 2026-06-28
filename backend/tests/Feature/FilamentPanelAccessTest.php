<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Filament\Panel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FilamentPanelAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_with_super_admin_can_access_filament_panel_logic(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('super_admin');

        $this->assertTrue($user->canAccessPanel(Panel::make()));
    }

    public function test_user_without_admin_role_cannot_access_filament_panel_logic(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('teacher');

        $this->assertFalse($user->canAccessPanel(Panel::make()));
    }
}
