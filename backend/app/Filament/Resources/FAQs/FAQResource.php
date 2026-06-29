<?php

namespace App\Filament\Resources\FAQs;

use App\Filament\Resources\FAQs\Pages\ManageFAQs;
use App\Models\FAQ;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class FAQResource extends Resource
{
    protected static ?string $model = FAQ::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'FAQs';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('FAQ')
                    ->schema([
                        TextInput::make('question')->required()->maxLength(255)->columnSpanFull(),
                        RichEditor::make('answer')->required()->columnSpanFull(),
                        TextInput::make('category')->maxLength(255),
                        TextInput::make('sort_order')->numeric()->minValue(0)->default(0)->required(),
                        Toggle::make('is_published')->inline(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('question')->searchable()->sortable(),
                TextColumn::make('category')->placeholder('Not set')->searchable()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_published'),
            ])
            ->defaultSort('sort_order')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageFAQs::route('/'),
        ];
    }
}
