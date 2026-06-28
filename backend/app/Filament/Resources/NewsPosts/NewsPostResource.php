<?php

namespace App\Filament\Resources\NewsPosts;

use App\Filament\Resources\NewsPosts\Pages\ManageNewsPosts;
use App\Models\NewsPost;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
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
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class NewsPostResource extends Resource
{
    protected static ?string $model = NewsPost::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'News Posts';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('News Post')
                    ->schema([
                        TextInput::make('title')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        Textarea::make('excerpt')->rows(3)->columnSpanFull(),
                        RichEditor::make('body')->columnSpanFull(),
                    ])->columns(2),
                Section::make('Details')
                    ->schema([
                        FileUpload::make('featured_image_path')
                            ->label('Featured image')
                            ->disk('public')
                            ->directory('cms/news')
                            ->image()
                            ->maxSize(4096),
                        TextInput::make('category')->maxLength(255),
                        TagsInput::make('tags'),
                        TextInput::make('author_name')->maxLength(255),
                        Toggle::make('is_featured')->inline(false),
                        Toggle::make('is_published')->inline(false),
                        DateTimePicker::make('published_at'),
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
                TextColumn::make('category')->placeholder('Not set')->searchable(),
                IconColumn::make('is_featured')->boolean()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('published_at')->dateTime()->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_featured'),
                TernaryFilter::make('is_published'),
            ])
            ->defaultSort('published_at', 'desc')
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
            'index' => ManageNewsPosts::route('/'),
        ];
    }
}
