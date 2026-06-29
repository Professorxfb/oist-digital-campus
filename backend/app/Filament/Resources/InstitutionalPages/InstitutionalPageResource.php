<?php

namespace App\Filament\Resources\InstitutionalPages;

use App\Filament\Resources\InstitutionalPages\Pages\ManageInstitutionalPages;
use App\Models\InstitutionalPage;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
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

class InstitutionalPageResource extends Resource
{
    protected static ?string $model = InstitutionalPage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'Institutional Pages';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Page Content')
                    ->schema([
                        TextInput::make('title')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        Select::make('page_type')
                            ->options(InstitutionalPage::PAGE_TYPES)
                            ->required()
                            ->default('general'),
                        TextInput::make('sort_order')->numeric()->minValue(0)->default(0)->required(),
                        Textarea::make('excerpt')->rows(3)->columnSpanFull(),
                        RichEditor::make('body')->columnSpanFull(),
                    ])->columns(2),
                Section::make('Media And Visibility')
                    ->schema([
                        FileUpload::make('featured_image_path')
                            ->label('Featured image')
                            ->disk('public')
                            ->directory('cms/institutional-pages')
                            ->image()
                            ->maxSize(4096),
                        Toggle::make('is_published')->inline(false),
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
                TextColumn::make('page_type')->badge()->searchable()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->filters([
                SelectFilter::make('page_type')->options(InstitutionalPage::PAGE_TYPES),
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
            'index' => ManageInstitutionalPages::route('/'),
        ];
    }
}
