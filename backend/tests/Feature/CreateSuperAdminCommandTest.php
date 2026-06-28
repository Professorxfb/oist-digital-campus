<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CreateSuperAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_creation_command_works(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $this->artisan('oist:create-super-admin')
            ->expectsQuestion('Name', 'Primary Admin')
            ->expectsQuestion('Email', 'admin@example.com')
            ->expectsQuestion('Password (minimum 12 characters)', 'secure-password-123')
            ->expectsOutput('Super admin user created.')
            ->expectsOutput('The super_admin role has been assigned.')
            ->assertSuccessful();

        $user = User::query()->where('email', 'admin@example.com')->firstOrFail();

        $this->assertSame('Primary Admin', $user->name);
        $this->assertTrue(Hash::check('secure-password-123', $user->password));
        $this->assertTrue($user->hasRole('super_admin'));
    }

    public function test_existing_user_can_be_promoted_after_confirmation(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $this->artisan('oist:create-super-admin')
            ->expectsQuestion('Name', 'Ignored Name')
            ->expectsQuestion('Email', 'existing@example.com')
            ->expectsConfirmation('Assign the super_admin role to this existing user?', 'yes')
            ->expectsOutput('The super_admin role has been assigned.')
            ->assertSuccessful();

        $this->assertTrue($user->fresh()->hasRole('super_admin'));
    }
}
