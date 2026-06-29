<?php

namespace App\Filament\Resources\LeadershipProfiles;

use App\Filament\Resources\LeadershipProfiles\Pages\ManageLeadershipProfiles;
use App\Models\LeadershipProfile;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
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

class LeadershipProfileResource extends Resource
{
    protected static ?string $model = LeadershipProfile::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Profile')
                    ->schema([
                        TextInput::make('name')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        TextInput::make('designation')->maxLength(255),
                        Textarea::make('short_bio')->rows(3)->columnSpanFull(),
                        RichEditor::make('message')->columnSpanFull(),
                    ])->columns(2),
                Section::make('Contact And Display')
                    ->schema([
                        FileUpload::make('photo_path')
                            ->label('Photo')
                            ->disk('public')
                            ->directory('cms/leadership')
                            ->image()
                            ->maxSize(4096),
                        TextInput::make('email')->email()->maxLength(255),
                        TextInput::make('phone')->tel()->maxLength(50),
                        TextInput::make('sort_order')->numeric()->minValue(0)->default(0)->required(),
                        Toggle::make('is_published')->inline(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('designation')->placeholder('Not set')->searchable()->sortable(),
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
            'index' => ManageLeadershipProfiles::route('/'),
        ];
    }
}
