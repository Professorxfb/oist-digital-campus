<?php

namespace App\Filament\Resources\AcademicPrograms;

use App\Filament\Resources\AcademicPrograms\Pages\ManageAcademicPrograms;
use App\Models\AcademicProgram;
use App\Support\CmsRecordDuplicator;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
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

class AcademicProgramResource extends Resource
{
    protected static ?string $model = AcademicProgram::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAcademicCap;

    protected static ?string $navigationLabel = 'Academic Programs';

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Program')
                    ->schema([
                        TextInput::make('title')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        TextInput::make('category')->maxLength(255),
                        Textarea::make('short_description')->rows(3)->columnSpanFull(),
                        RichEditor::make('description')->columnSpanFull(),
                    ])->columns(2),
                Section::make('Card Display')
                    ->schema([
                        FileUpload::make('featured_image_path')
                            ->label('Featured image')
                            ->disk('public')
                            ->directory('cms/academic-programs')
                            ->image()
                            ->maxSize(4096),
                        Select::make('icon')
                            ->options([
                                'cap' => 'Graduation cap',
                                'book' => 'Book',
                                'code' => 'Code / computing',
                                'engineering' => 'Engineering',
                                'science' => 'Science',
                                'law' => 'Law / scales',
                                'business' => 'Business',
                            ])
                            ->searchable(),
                        TagsInput::make('bullet_points')
                            ->label('Bullet points')
                            ->helperText('Add up to three short card bullets for the homepage card.'),
                        TextInput::make('button_text')->maxLength(255),
                        TextInput::make('button_url')->maxLength(255),
                    ])->columns(2),
                Section::make('Publication')
                    ->schema([
                        TextInput::make('sort_order')->numeric()->minValue(0)->default(0)->required(),
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
                TextColumn::make('category')->badge()->placeholder('Not set')->searchable()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->filters([
                SelectFilter::make('category')->options(fn (): array => AcademicProgram::query()
                    ->whereNotNull('category')
                    ->distinct()
                    ->orderBy('category')
                    ->pluck('category', 'category')
                    ->all()),
                TernaryFilter::make('is_published'),
            ])
            ->defaultSort('sort_order')
            ->recordActions([
                Action::make('duplicate')
                    ->label('Duplicate')
                    ->icon(Heroicon::Square2Stack)
                    ->color('gray')
                    ->requiresConfirmation()
                    ->modalDescription('Duplicate this record? The copy will be created as unpublished/disabled.')
                    ->successNotificationTitle('Academic program duplicated as an unpublished copy.')
                    ->action(fn (AcademicProgram $record): AcademicProgram => CmsRecordDuplicator::duplicate($record)),
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
            'index' => ManageAcademicPrograms::route('/'),
        ];
    }
}
