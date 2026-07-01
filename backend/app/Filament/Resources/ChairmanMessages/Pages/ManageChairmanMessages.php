<?php

namespace App\Filament\Resources\ChairmanMessages\Pages;

use App\Filament\Resources\ChairmanMessages\ChairmanMessageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageChairmanMessages extends ManageRecords
{
    protected static string $resource = ChairmanMessageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
