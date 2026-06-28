<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * @var list<string>
     */
    private const ROLES = [
        'super_admin',
        'admin',
        'principal',
        'admission_officer',
        'academic_officer',
        'accounts_officer',
        'cms_editor',
        'teacher',
        'student',
        'applicant',
        'staff',
    ];

    /**
     * @var list<string>
     */
    private const PERMISSIONS = [
        'users.view',
        'users.create',
        'users.update',
        'users.delete',
        'roles.view',
        'roles.manage',
        'settings.view',
        'settings.manage',
        'reports.view',
        'audit_logs.view',
        'cms.view',
        'cms.manage',
        'admissions.view',
        'admissions.manage',
        'academics.view',
        'academics.manage',
        'accounts.view',
        'accounts.manage',
        'students.view',
        'students.manage',
        'teachers.view',
        'teachers.manage',
    ];

    /**
     * @var array<string, list<string>>
     */
    private const ROLE_PERMISSIONS = [
        'admin' => [
            'users.view',
            'users.create',
            'users.update',
            'roles.view',
            'settings.view',
            'reports.view',
            'audit_logs.view',
            'cms.view',
            'cms.manage',
            'admissions.view',
            'admissions.manage',
            'academics.view',
            'academics.manage',
            'accounts.view',
            'accounts.manage',
            'students.view',
            'students.manage',
            'teachers.view',
            'teachers.manage',
        ],
        'principal' => [
            'reports.view',
            'audit_logs.view',
            'cms.view',
            'admissions.view',
            'academics.view',
            'accounts.view',
            'students.view',
            'teachers.view',
        ],
        'admission_officer' => [
            'admissions.view',
            'admissions.manage',
            'students.view',
            'reports.view',
        ],
        'academic_officer' => [
            'academics.view',
            'academics.manage',
            'students.view',
            'students.manage',
            'teachers.view',
            'teachers.manage',
            'reports.view',
        ],
        'accounts_officer' => [
            'accounts.view',
            'accounts.manage',
            'students.view',
            'reports.view',
        ],
        'cms_editor' => [
            'cms.view',
            'cms.manage',
        ],
        'teacher' => [
            'academics.view',
            'students.view',
        ],
        'student' => [],
        'applicant' => [],
        'staff' => [
            'reports.view',
        ],
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (self::PERMISSIONS as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        foreach (self::ROLES as $role) {
            Role::findOrCreate($role, 'web');
        }

        Role::findByName('super_admin', 'web')->syncPermissions(self::PERMISSIONS);

        foreach (self::ROLE_PERMISSIONS as $role => $permissions) {
            Role::findByName($role, 'web')->syncPermissions($permissions);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
