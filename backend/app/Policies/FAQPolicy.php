<?php

namespace App\Policies;

use App\Models\FAQ;
use App\Models\User;

class FAQPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManageInstitutionalCms($user);
    }

    public function view(User $user, FAQ $faq): bool
    {
        return $this->canManageInstitutionalCms($user);
    }

    public function create(User $user): bool
    {
        return $this->canManageInstitutionalCms($user);
    }

    public function update(User $user, FAQ $faq): bool
    {
        return $this->canManageInstitutionalCms($user);
    }

    public function delete(User $user, FAQ $faq): bool
    {
        return $this->canManageInstitutionalCms($user);
    }

    public function deleteAny(User $user): bool
    {
        return $this->canManageInstitutionalCms($user);
    }

    private function canManageInstitutionalCms(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'cms_editor', 'academic_officer']);
    }
}
