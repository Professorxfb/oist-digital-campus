<?php

namespace App\Policies;

use App\Models\GalleryAlbum;
use App\Models\User;

class GalleryAlbumPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function view(User $user, GalleryAlbum $galleryAlbum): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function create(User $user): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function update(User $user, GalleryAlbum $galleryAlbum): bool
    {
        return $this->canManagePublicCms($user);
    }

    public function delete(User $user, GalleryAlbum $galleryAlbum): bool
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
