<?php

namespace App\Policies;

use App\Models\LeadershipProfile;
use App\Models\User;

class LeadershipProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function view(User $user, LeadershipProfile $leadershipProfile): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function create(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function update(User $user, LeadershipProfile $leadershipProfile): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function delete(User $user, LeadershipProfile $leadershipProfile): bool
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
