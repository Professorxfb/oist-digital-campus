<?php

namespace App\Filament\Resources\LeadershipProfiles\Pages;

use App\Filament\Resources\LeadershipProfiles\LeadershipProfileResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageLeadershipProfiles extends ManageRecords
{
    protected static string $resource = LeadershipProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
