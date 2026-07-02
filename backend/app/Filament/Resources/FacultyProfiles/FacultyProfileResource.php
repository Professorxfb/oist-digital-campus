<?php

namespace App\Filament\Resources\FacultyProfiles;

use App\Filament\Resources\FacultyProfiles\Pages\ManageFacultyProfiles;
use App\Models\FacultyProfile;
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

class FacultyProfileResource extends Resource
{
    protected static ?string $model = FacultyProfile::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Profile')
                    ->schema([
                        TextInput::make('name')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        TextInput::make('designation')->maxLength(255),
                        Select::make('department_id')
                            ->label('Department')
                            ->relationship('department', 'name')
                            ->searchable()
                            ->preload(),
                    ])->columns(2),
                Section::make('Photo')
                    ->schema([
                        FileUpload::make('photo_path')
                            ->label('Photo')
                            ->disk('public')
                            ->directory('cms/faculty')
                            ->image()
                            ->maxSize(4096)
                            ->helperText('Used on homepage professor card and profile detail page.'),
                    ])->columns(1),
                Section::make('Bio / Introduction')
                    ->schema([
                        Textarea::make('short_bio')
                            ->label('Short Bio')
                            ->rows(4)
                            ->helperText('Brief introduction used in cards and summaries.')
                            ->columnSpanFull(),
                        RichEditor::make('detailed_bio')
                            ->label('Detailed Bio')
                            ->helperText('Full introduction shown on the detail page.')
                            ->columnSpanFull(),
                    ])->columns(1),
                Section::make('Academic Details')
                    ->schema([
                        Textarea::make('qualifications')
                            ->rows(5)
                            ->helperText('One item per line.')
                            ->columnSpanFull(),
                        Textarea::make('research_interests')
                            ->label('Research Interests')
                            ->rows(5)
                            ->helperText('One item per line.')
                            ->columnSpanFull(),
                        Textarea::make('expertise')
                            ->rows(5)
                            ->helperText('One item per line.')
                            ->columnSpanFull(),
                    ])->columns(1),
                Section::make('Contact Information')
                    ->schema([
                        TextInput::make('email')->email()->maxLength(255),
                        TextInput::make('phone')->tel()->maxLength(255),
                        TextInput::make('office_location')
                            ->label('Office Location / Address')
                            ->maxLength(255),
                    ])->columns(2),
                Section::make('Social Links')
                    ->schema([
                        TextInput::make('facebook_url')
                            ->label('Facebook Profile URL')
                            ->url()
                            ->maxLength(2048)
                            ->helperText('Shown as hover icons on cards and on the detail page.'),
                        TextInput::make('linkedin_url')
                            ->label('LinkedIn Profile URL')
                            ->url()
                            ->maxLength(2048),
                        TextInput::make('twitter_url')
                            ->label('X / Twitter Profile URL')
                            ->url()
                            ->maxLength(2048),
                        TextInput::make('website_url')
                            ->label('Website URL')
                            ->url()
                            ->maxLength(2048),
                    ])->columns(2),
                Section::make('Publishing')
                    ->schema([
                        TextInput::make('sort_order')->numeric()->minValue(0)->default(0)->required(),
                        Toggle::make('is_published')->inline(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('designation')->placeholder('Not set')->searchable(),
                TextColumn::make('department.name')->placeholder('Not assigned')->searchable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
            ])
            ->filters([
                SelectFilter::make('department_id')
                    ->label('Department')
                    ->relationship('department', 'name'),
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
            'index' => ManageFacultyProfiles::route('/'),
        ];
    }
}
