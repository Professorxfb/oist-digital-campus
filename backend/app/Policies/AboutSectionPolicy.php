<?php

namespace App\Policies;

use App\Models\AboutSection;
use App\Models\User;

class AboutSectionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'cms_editor']);
    }

    public function view(User $user, AboutSection $aboutSection): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, AboutSection $aboutSection): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, AboutSection $aboutSection): bool
    {
        return $this->viewAny($user);
    }

    public function deleteAny(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function reorder(User $user): bool
    {
        return $this->viewAny($user);
    }
}
