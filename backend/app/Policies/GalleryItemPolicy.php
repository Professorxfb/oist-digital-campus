<?php

namespace App\Policies;

use App\Models\GalleryItem;
use App\Models\User;

class GalleryItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function view(User $user, GalleryItem $galleryItem): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function create(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function update(User $user, GalleryItem $galleryItem): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function delete(User $user, GalleryItem $galleryItem): bool
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
