<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Download;
use App\Models\Event;
use App\Models\FacultyProfile;
use App\Models\GalleryAlbum;
use App\Models\GalleryItem;
use App\Models\NewsPost;
use App\Models\Notice;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class PublicContentPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_cms_roles_can_manage_public_content_modules(): void
    {
        $this->seed(RolePermissionSeeder::class);

        foreach (['super_admin', 'admin', 'cms_editor'] as $role) {
            $user = User::factory()->create();
            $user->assignRole($role);

            $this->assertTrue(Gate::forUser($user)->allows('viewAny', Notice::class));
            $this->assertTrue(Gate::forUser($user)->allows('viewAny', NewsPost::class));
            $this->assertTrue(Gate::forUser($user)->allows('viewAny', Event::class));
            $this->assertTrue(Gate::forUser($user)->allows('viewAny', GalleryAlbum::class));
            $this->assertTrue(Gate::forUser($user)->allows('viewAny', GalleryItem::class));
            $this->assertTrue(Gate::forUser($user)->allows('viewAny', Download::class));
            $this->assertTrue(Gate::forUser($user)->allows('viewAny', Department::class));
            $this->assertTrue(Gate::forUser($user)->allows('viewAny', FacultyProfile::class));
        }
    }

    public function test_academic_officer_can_manage_departments_and_faculty_only(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('academic_officer');

        $this->assertTrue(Gate::forUser($user)->allows('viewAny', Department::class));
        $this->assertTrue(Gate::forUser($user)->allows('viewAny', FacultyProfile::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', Notice::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', NewsPost::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', Event::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', GalleryAlbum::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', GalleryItem::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', Download::class));
    }

    public function test_other_roles_cannot_manage_public_content_modules(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('teacher');

        $this->assertFalse(Gate::forUser($user)->allows('viewAny', Notice::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', NewsPost::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', Event::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', GalleryAlbum::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', GalleryItem::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', Download::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', Department::class));
        $this->assertFalse(Gate::forUser($user)->allows('viewAny', FacultyProfile::class));
    }
}
