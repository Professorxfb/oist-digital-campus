<?php

namespace App\Policies;

use App\Models\HomepageSection;
use App\Models\User;

class HomepageSectionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'cms_editor']);
    }

    public function view(User $user, HomepageSection $homepageSection): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, HomepageSection $homepageSection): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, HomepageSection $homepageSection): bool
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
