<?php

namespace App\Filament\Resources\HeroFeatureCards\Pages;

use App\Filament\Resources\HeroFeatureCards\HeroFeatureCardResource;
use App\Models\HeroFeatureCard;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageHeroFeatureCards extends ManageRecords
{
    protected static string $resource = HeroFeatureCardResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->visible(fn (): bool => HeroFeatureCard::query()->count() < 3),
        ];
    }
}
