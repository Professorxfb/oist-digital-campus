<?php

namespace App\Filament\Resources\FacultyProfiles\Pages;

use App\Filament\Resources\FacultyProfiles\FacultyProfileResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageFacultyProfiles extends ManageRecords
{
    protected static string $resource = FacultyProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
