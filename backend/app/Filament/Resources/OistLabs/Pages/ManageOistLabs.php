<?php

namespace App\Filament\Resources\OistLabs\Pages;

use App\Filament\Resources\OistLabs\OistLabResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageOistLabs extends ManageRecords
{
    protected static string $resource = OistLabResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
