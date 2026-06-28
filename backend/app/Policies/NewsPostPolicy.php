<?php

namespace App\Policies;

use App\Models\NewsPost;
use App\Models\User;

class NewsPostPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function view(User $user, NewsPost $newsPost): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function create(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function update(User $user, NewsPost $newsPost): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function delete(User $user, NewsPost $newsPost): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function deleteAny(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    private function canManagePublicCms(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'cms_editor']);
    }
}
