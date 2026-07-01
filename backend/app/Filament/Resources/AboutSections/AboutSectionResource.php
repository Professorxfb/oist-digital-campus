<?php

namespace App\Filament\Resources\AboutSections;

use App\Filament\Resources\AboutSections\Pages\ManageAboutSections;
use App\Models\AboutSection;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
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

class AboutSectionResource extends Resource
{
    protected static ?string $model = AboutSection::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInformationCircle;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'About Section';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('About Content')
                    ->schema([
                        TextInput::make('title')->maxLength(255),
                        TextInput::make('subtitle')
                            ->label('Subtitle / Eyebrow')
                            ->maxLength(255),
                        RichEditor::make('content')
                            ->label('Body / Content')
                            ->columnSpanFull(),
                    ])->columns(2),
                Section::make('Media and Action')
                    ->schema([
                        FileUpload::make('main_image_path')
                            ->label('Main Image')
                            ->disk('public')
                            ->directory('cms/about')
                            ->visibility('public')
                            ->image()
                            ->maxSize(4096),
                        FileUpload::make('gallery_images')
                            ->label('Gallery Images')
                            ->disk('public')
                            ->directory('cms/about/gallery')
                            ->visibility('public')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            ->maxFiles(8)
                            ->maxSize(4096),
                        FileUpload::make('video_path')
                            ->label('Uploaded Video')
                            ->disk('public')
                            ->directory('cms/about/videos')
                            ->visibility('public')
                            ->acceptedFileTypes(['video/mp4', 'video/webm'])
                            ->maxSize(51200),
                        TextInput::make('video_url')
                            ->label('External Video URL')
                            ->url()
                            ->maxLength(2048),
                        TextInput::make('button_text')->maxLength(255),
                        TextInput::make('button_url')->maxLength(255),
                    ])->columns(2),
                Section::make('Feature Bullets')
                    ->schema([
                        Repeater::make('feature_bullets')
                            ->schema([
                                TextInput::make('title')->required()->maxLength(255),
                                TextInput::make('description')->maxLength(500),
                            ])
                            ->addActionLabel('Add feature bullet')
                            ->reorderable()
                            ->columnSpanFull(),
                    ]),
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
            'index' => ManageAboutSections::route('/'),
        ];
    }
}
