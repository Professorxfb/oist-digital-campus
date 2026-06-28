<?php

namespace Tests\Feature;

use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RolePermissionSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_role_permission_seeder_can_run_successfully(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->assertSame(11, Role::query()->count());
        $this->assertSame(22, Permission::query()->count());

        $superAdmin = Role::findByName('super_admin');

        $this->assertTrue($superAdmin->hasPermissionTo('users.view'));
        $this->assertTrue($superAdmin->hasPermissionTo('teachers.manage'));
    }
}
