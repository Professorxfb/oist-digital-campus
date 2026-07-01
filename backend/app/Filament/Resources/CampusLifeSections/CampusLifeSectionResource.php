<?php

namespace App\Filament\Resources\CampusLifeSections;

use App\Filament\Resources\CampusLifeSections\Pages\ManageCampusLifeSections;
use App\Models\CampusLifeSection;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
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

class CampusLifeSectionResource extends Resource
{
    protected static ?string $model = CampusLifeSection::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'Campus Life';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Campus Life Content')
                    ->schema([
                        TextInput::make('title')->maxLength(255),
                        TextInput::make('subtitle')->maxLength(255),
                        RichEditor::make('description')->columnSpanFull(),
                    ])->columns(2),
                Section::make('Media and Action')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Image')
                            ->disk('public')
                            ->directory('cms/campus-life')
                            ->visibility('public')
                            ->image()
                            ->maxSize(4096),
                        FileUpload::make('video_path')
                            ->label('Uploaded Video')
                            ->disk('public')
                            ->directory('cms/campus-life/videos')
                            ->visibility('public')
                            ->acceptedFileTypes(['video/mp4', 'video/webm'])
                            ->maxSize(51200),
                        TextInput::make('video_url')
                            ->label('External Video URL')
                            ->url()
                            ->maxLength(2048),
                        FileUpload::make('gallery_images')
                            ->label('Gallery Images')
                            ->disk('public')
                            ->directory('cms/campus-life/gallery')
                            ->visibility('public')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            ->maxFiles(8)
                            ->maxSize(4096)
                            ->columnSpanFull(),
                        TextInput::make('button_text')->maxLength(255),
                        TextInput::make('button_url')->maxLength(255),
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
                TextColumn::make('subtitle')->placeholder('Not set')->searchable(),
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
            'index' => ManageCampusLifeSections::route('/'),
        ];
    }
}
