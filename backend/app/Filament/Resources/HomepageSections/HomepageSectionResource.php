<?php

namespace App\Filament\Resources\HomepageSections;

use App\Filament\Resources\HomepageSections\Pages\ManageHomepageSections;
use App\Models\HomepageSection;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
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

class HomepageSectionResource extends Resource
{
    protected static ?string $model = HomepageSection::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    protected static ?string $navigationLabel = 'Homepage Sections';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Section Content')
                    ->description('Homepage Sections controls section order and visibility. Use the content fields for simple CMS-driven homepage sections such as Admissions.')
                    ->schema([
                        TextInput::make('key')
                            ->required()
                            ->regex('/^[a-z0-9_-]+$/')
                            ->maxLength(255)
                            ->helperText('Use lowercase letters, numbers, underscores, or hyphens.'),
                        TextInput::make('title')->maxLength(255),
                        TextInput::make('subtitle')
                            ->label('Subtitle / Short Label')
                            ->maxLength(255),
                        Textarea::make('content')
                            ->label('Description / Content')
                            ->rows(4)
                            ->columnSpanFull(),
                        FileUpload::make('image_path')
                            ->label('Section Image')
                            ->disk('public')
                            ->directory('cms/homepage-sections')
                            ->visibility('public')
                            ->image()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                            ->maxSize(4096)
                            ->imagePreviewHeight('180')
                            ->previewable()
                            ->openable()
                            ->downloadable()
                            ->deletable()
                            ->nullable(),
                        TextInput::make('button_text')->maxLength(255),
                        TextInput::make('button_url')->maxLength(2048),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->minValue(0)
                            ->default(0)
                            ->required(),
                        Toggle::make('is_enabled')->inline(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')->searchable()->sortable(),
                TextColumn::make('title')->placeholder('Not set')->searchable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
                IconColumn::make('is_enabled')->boolean()->sortable(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_enabled'),
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
            'index' => ManageHomepageSections::route('/'),
        ];
    }
}
