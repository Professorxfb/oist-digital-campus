<?php

namespace App\Policies;

use App\Models\HeroFeatureCard;
use App\Models\User;

class HeroFeatureCardPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'admin', 'cms_editor']);
    }

    public function view(User $user, HeroFeatureCard $heroFeatureCard): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user) && HeroFeatureCard::query()->count() < 3;
    }

    public function update(User $user, HeroFeatureCard $heroFeatureCard): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, HeroFeatureCard $heroFeatureCard): bool
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
