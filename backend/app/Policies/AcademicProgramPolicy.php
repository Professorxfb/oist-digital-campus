<?php

namespace App\Policies;

use App\Models\AcademicProgram;
use App\Models\User;

class AcademicProgramPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManageAcademicPrograms($user);
    }

    public function view(User $user, AcademicProgram $academicProgram): bool
    {
        return $this->canManageAcademicPrograms($user);
    }

    public function create(User $user): bool
    {
        return $this->canManageAcademicPrograms($user);
    }

    public function update(User $user, AcademicProgram $academicProgram): bool
    {
        return $this->canManageAcademicPrograms($user);
    }

    public function delete(User $user, AcademicProgram $academicProgram): bool
    {
        return $this->canManageAcademicPrograms($user);
    }

    public function deleteAny(User $user): bool
    {
        return $this->canManageAcademicPrograms($user);
    }

    private function canManageAcademicPrograms(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'cms_editor', 'academic_officer']);
    }
}
