<?php

namespace App\Filament\Resources\Videos;

use App\Filament\Resources\Videos\Pages\ManageVideos;
use App\Models\Video;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class VideoResource extends Resource
{
    protected static ?string $model = Video::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Video')
                    ->schema([
                        TextInput::make('title')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        Textarea::make('excerpt')->rows(3)->columnSpanFull(),
                        RichEditor::make('description')->columnSpanFull(),
                    ])->columns(2),
                Section::make('Source')
                    ->schema([
                        Select::make('video_type')
                            ->options(Video::VIDEO_TYPES)
                            ->required()
                            ->default('external'),
                        Select::make('category')
                            ->options(Video::CATEGORIES)
                            ->searchable(),
                        TextInput::make('video_url')->url()->maxLength(2048),
                        TextInput::make('embed_url')->url()->maxLength(2048),
                        FileUpload::make('thumbnail_path')
                            ->label('Thumbnail')
                            ->disk('public')
                            ->directory('cms/videos/thumbnails')
                            ->image()
                            ->maxSize(4096),
                        TagsInput::make('tags'),
                    ])->columns(2),
                Section::make('Publication')
                    ->schema([
                        DatePicker::make('event_date'),
                        DateTimePicker::make('published_at'),
                        Toggle::make('is_featured')->inline(false),
                        Toggle::make('is_published')->inline(false),
                        TextInput::make('sort_order')->numeric()->minValue(0)->default(0)->required(),
                    ])->columns(2),
                Section::make('SEO')
                    ->schema([
                        TextInput::make('meta_title')->maxLength(255),
                        Textarea::make('meta_description')->maxLength(500)->rows(3),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('video_type')->badge()->sortable(),
                TextColumn::make('category')->badge()->placeholder('Not set')->searchable()->sortable(),
                IconColumn::make('is_featured')->boolean()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('published_at')->dateTime()->sortable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
            ])
            ->filters([
                SelectFilter::make('video_type')->options(Video::VIDEO_TYPES),
                SelectFilter::make('category')->options(Video::CATEGORIES),
                TernaryFilter::make('is_featured'),
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
            'index' => ManageVideos::route('/'),
        ];
    }
}
