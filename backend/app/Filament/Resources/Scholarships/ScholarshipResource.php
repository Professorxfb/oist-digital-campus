<?php

namespace App\Filament\Resources\Scholarships;

use App\Filament\Resources\Scholarships\Pages\ManageScholarships;
use App\Models\Scholarship;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
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

class ScholarshipResource extends Resource
{
    protected static ?string $model = Scholarship::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Scholarship')
                    ->schema([
                        TextInput::make('title')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        Textarea::make('summary')->rows(3)->columnSpanFull(),
                        RichEditor::make('description')->columnSpanFull(),
                        RichEditor::make('eligibility')->columnSpanFull(),
                        RichEditor::make('benefits')->columnSpanFull(),
                        RichEditor::make('application_process')->columnSpanFull(),
                    ])->columns(2),
                Section::make('Publication')
                    ->schema([
                        DatePicker::make('deadline'),
                        FileUpload::make('attachment_path')
                            ->label('Attachment')
                            ->disk('public')
                            ->directory('cms/scholarships')
                            ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(20480),
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
                TextColumn::make('deadline')->date()->sortable(),
                IconColumn::make('is_featured')->boolean()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
            ])
            ->filters([
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
            'index' => ManageScholarships::route('/'),
        ];
    }
}
