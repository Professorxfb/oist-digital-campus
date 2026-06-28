<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;

class DepartmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function view(User $user, Department $department): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function create(User $user): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function update(User $user, Department $department): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function delete(User $user, Department $department): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function deleteAny(User $user): bool
    {
        return $this->canManageAcademicCms($user);
    }

    private function canManageAcademicCms(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'cms_editor', 'academic_officer']);
    }
}
