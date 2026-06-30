<?php

namespace App\Filament\Resources\HomepageSections;

use App\Filament\Resources\HomepageSections\Pages\ManageHomepageSections;
use App\Models\HomepageSection;
use App\Support\CmsRecordDuplicator;
use BackedEnum;
use Filament\Actions\Action;
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
                    ->schema([
                        TextInput::make('key')
                            ->required()
                            ->regex('/^[a-z0-9_-]+$/')
                            ->maxLength(255)
                            ->helperText('Use lowercase letters, numbers, underscores, or hyphens.'),
                        TextInput::make('title')->maxLength(255),
                        TextInput::make('subtitle')->maxLength(255),
                        Textarea::make('content')->rows(5)->columnSpanFull(),
                    ])->columns(2),
                Section::make('Media and Action')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Image')
                            ->disk('public')
                            ->directory('homepage-sections/images')
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
                        FileUpload::make('video_path')
                            ->label('Video')
                            ->disk('public')
                            ->directory('homepage-sections/videos')
                            ->visibility('public')
                            ->acceptedFileTypes(['video/mp4', 'video/webm'])
                            ->maxSize(51200)
                            ->previewable()
                            ->openable()
                            ->downloadable()
                            ->deletable()
                            ->nullable(),
                        TextInput::make('button_text')->maxLength(255),
                        TextInput::make('button_url')->maxLength(255),
                    ])->columns(2),
                Section::make('Additional CMS Media')
                    ->description('Optional media for richer section layouts. Existing main image/video fields continue to work as fallbacks.')
                    ->schema([
                        FileUpload::make('metadata.gallery_images')
                            ->label('Gallery Images')
                            ->disk('public')
                            ->directory('homepage-sections/gallery')
                            ->visibility('public')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                            ->maxSize(4096)
                            ->maxFiles(8)
                            ->imagePreviewHeight('140')
                            ->previewable()
                            ->openable()
                            ->downloadable()
                            ->deletable()
                            ->nullable()
                            ->columnSpanFull(),
                        TextInput::make('metadata.video_url')
                            ->label('External Video URL')
                            ->url()
                            ->maxLength(2048)
                            ->helperText('Use a YouTube or other public video URL when the section needs an embedded video.'),
                    ])->columns(2),
                Section::make('Display Rules')
                    ->schema([
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
                Action::make('duplicate')
                    ->label('Duplicate')
                    ->icon(Heroicon::Square2Stack)
                    ->color('gray')
                    ->requiresConfirmation()
                    ->modalDescription('Duplicate this record? The copy will be created as unpublished/disabled.')
                    ->successNotificationTitle('Homepage section duplicated as a disabled copy.')
                    ->action(fn (HomepageSection $record): HomepageSection => CmsRecordDuplicator::duplicate($record)),
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
