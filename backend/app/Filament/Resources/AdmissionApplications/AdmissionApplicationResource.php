<?php

namespace App\Filament\Resources\AdmissionApplications;

use App\Filament\Resources\AdmissionApplications\Pages\ManageAdmissionApplications;
use App\Models\AdmissionApplication;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AdmissionApplicationResource extends Resource
{
    protected static ?string $model = AdmissionApplication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'Admission Applications';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Applicant Information')
                    ->schema([
                        TextInput::make('first_name')->required()->maxLength(255),
                        TextInput::make('last_name')->required()->maxLength(255),
                        TextInput::make('email')->email()->required()->maxLength(255),
                        TextInput::make('phone')->required()->maxLength(50),
                        DatePicker::make('date_of_birth'),
                        TextInput::make('preferred_program')->maxLength(255),
                    ])->columns(2),
                Section::make('Address')
                    ->schema([
                        Textarea::make('address')->rows(3)->columnSpanFull(),
                        TextInput::make('country')->maxLength(255),
                        TextInput::make('city')->maxLength(255),
                        TextInput::make('zip_code')->maxLength(30),
                    ])->columns(3),
                Section::make('Application Message')
                    ->schema([
                        Textarea::make('message')->rows(4)->columnSpanFull(),
                    ]),
                Section::make('Admin Review')
                    ->schema([
                        Select::make('status')
                            ->options(AdmissionApplication::STATUSES)
                            ->required()
                            ->default('new'),
                        TextInput::make('source')->maxLength(255),
                        Textarea::make('notes')
                            ->label('Internal Notes')
                            ->rows(5)
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('applicant_name')->label('Applicant')->searchable(['first_name', 'last_name'])->sortable(['first_name']),
                TextColumn::make('email')->searchable()->sortable(),
                TextColumn::make('phone')->searchable(),
                TextColumn::make('country')->placeholder('Not set')->searchable()->sortable(),
                TextColumn::make('city')->placeholder('Not set')->searchable()->sortable(),
                TextColumn::make('status')->badge()->sortable(),
                TextColumn::make('created_at')->label('Submitted At')->dateTime()->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(AdmissionApplication::STATUSES),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                ViewAction::make(),
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
            'index' => ManageAdmissionApplications::route('/'),
        ];
    }
}
