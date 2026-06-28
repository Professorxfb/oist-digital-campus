<?php

namespace App\Policies;

use App\Models\FacultyProfile;
use App\Models\User;

class FacultyProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function view(User $user, FacultyProfile $facultyProfile): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function create(User $user): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function update(User $user, FacultyProfile $facultyProfile): bool
    {
        return $this->canManageAcademicCms($user);
    }

    public function delete(User $user, FacultyProfile $facultyProfile): bool
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
