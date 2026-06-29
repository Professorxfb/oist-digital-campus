<?php

namespace App\Filament\Resources\InstitutionalPages\Pages;

use App\Filament\Resources\InstitutionalPages\InstitutionalPageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageInstitutionalPages extends ManageRecords
{
    protected static string $resource = InstitutionalPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
