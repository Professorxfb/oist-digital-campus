<?php

namespace App\Filament\Resources\OistLabs;

use App\Filament\Resources\OistLabs\Pages\ManageOistLabs;
use App\Models\OistLab;
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

class OistLabResource extends Resource
{
    protected static ?string $model = OistLab::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBeaker;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'OIST Lab';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('OIST Lab Showcase')
                    ->schema([
                        TextInput::make('title')->maxLength(255),
                        FileUpload::make('main_image_path')
                            ->label('Main Image')
                            ->disk('public')
                            ->directory('cms/oist-lab')
                            ->visibility('public')
                            ->image()
                            ->maxSize(4096),
                        FileUpload::make('gallery_images')
                            ->label('Gallery Images')
                            ->disk('public')
                            ->directory('cms/oist-lab/gallery')
                            ->visibility('public')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            ->maxFiles(8)
                            ->maxSize(4096)
                            ->columnSpanFull(),
                        Textarea::make('gallery_captions')
                            ->label('Gallery Captions')
                            ->rows(3)
                            ->helperText('Optional captions, one per line, matching the main image plus gallery image order.')
                            ->dehydrateStateUsing(fn (?string $state): ?array => filled($state)
                                ? array_values(array_filter(array_map('trim', preg_split('/\r?\n/', $state) ?: [])))
                                : null)
                            ->formatStateUsing(fn (mixed $state): ?string => is_array($state) ? implode(PHP_EOL, $state) : $state)
                            ->columnSpanFull(),
                    ])->columns(2),
                Section::make('Display Rules')
                    ->schema([
                        TextInput::make('sort_order')
                            ->numeric()
                            ->minValue(0)
                            ->default(0)
                            ->required(),
                        Toggle::make('is_published')
                            ->default(true)
                            ->inline(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->placeholder('Not set')->searchable()->sortable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
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
            'index' => ManageOistLabs::route('/'),
        ];
    }
}
