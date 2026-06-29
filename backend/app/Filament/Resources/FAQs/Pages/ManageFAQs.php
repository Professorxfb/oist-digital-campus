<?php

namespace App\Filament\Resources\FAQs\Pages;

use App\Filament\Resources\FAQs\FAQResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageFAQs extends ManageRecords
{
    protected static string $resource = FAQResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
