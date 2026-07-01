<?php

namespace App\Filament\Resources\CampusLifeSections\Pages;

use App\Filament\Resources\CampusLifeSections\CampusLifeSectionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageCampusLifeSections extends ManageRecords
{
    protected static string $resource = CampusLifeSectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
