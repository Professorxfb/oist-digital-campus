<?php

namespace App\Filament\Resources\AcademicPrograms\Pages;

use App\Filament\Resources\AcademicPrograms\AcademicProgramResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageAcademicPrograms extends ManageRecords
{
    protected static string $resource = AcademicProgramResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
