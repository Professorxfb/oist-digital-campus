<?php

namespace App\Filament\Resources\SiteSettings;

use App\Filament\Resources\SiteSettings\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use BackedEnum;
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
use Filament\Tables\Table;

class SiteSettingResource extends Resource
{
    protected static ?string $model = SiteSetting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static ?string $navigationLabel = 'Site Settings';

    protected static ?string $modelLabel = 'Site Setting';

    protected static ?string $pluralModelLabel = 'Site Settings';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identity')
                    ->schema([
                        TextInput::make('institute_name')->maxLength(255),
                        TextInput::make('site_title')->maxLength(255),
                        TextInput::make('site_tagline')->maxLength(255),
                    ])->columns(2),
                Section::make('SEO')
                    ->schema([
                        TextInput::make('meta_title')->maxLength(255),
                        Textarea::make('meta_description')->maxLength(500)->rows(3),
                    ]),
                Section::make('Brand Assets')
                    ->schema([
                        FileUpload::make('logo_path')
                            ->label('Logo')
                            ->disk('public')
                            ->directory('site-settings/logos')
                            ->image()
                            ->maxSize(2048),
                        FileUpload::make('dark_logo_path')
                            ->label('Dark logo')
                            ->disk('public')
                            ->directory('site-settings/logos')
                            ->image()
                            ->maxSize(2048),
                        FileUpload::make('favicon_path')
                            ->label('Favicon')
                            ->disk('public')
                            ->directory('site-settings/favicons')
                            ->image()
                            ->maxSize(512),
                    ])->columns(3),
                Section::make('Contact')
                    ->schema([
                        TextInput::make('primary_phone')->tel()->maxLength(255),
                        TextInput::make('secondary_phone')->tel()->maxLength(255),
                        TextInput::make('email')->email()->maxLength(255),
                        Textarea::make('address')->rows(3),
                        TextInput::make('google_map_url')->url()->maxLength(255),
                    ])->columns(2),
                Section::make('Social Links')
                    ->schema([
                        TextInput::make('facebook_url')->url()->maxLength(255),
                        TextInput::make('youtube_url')->url()->maxLength(255),
                        TextInput::make('linkedin_url')->url()->maxLength(255),
                        TextInput::make('whatsapp_number')->tel()->maxLength(255),
                    ])->columns(2),
                Section::make('Footer and Admission')
                    ->schema([
                        Textarea::make('footer_text')->rows(3),
                        TextInput::make('admission_cta_text')->maxLength(255),
                        TextInput::make('admission_cta_url')->maxLength(255),
                        Toggle::make('is_admission_open')->inline(false),
                    ])->columns(2),
                Section::make('Popup Notice')
                    ->schema([
                        TextInput::make('popup_notice_title')->maxLength(255),
                        Textarea::make('popup_notice_body')->rows(4),
                        Toggle::make('is_popup_notice_enabled')->inline(false),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('site_title')->placeholder('Not set')->searchable(),
                TextColumn::make('email')->placeholder('Not set')->searchable(),
                IconColumn::make('is_admission_open')->boolean(),
                IconColumn::make('is_popup_notice_enabled')->boolean(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSiteSettings::route('/'),
        ];
    }
}
