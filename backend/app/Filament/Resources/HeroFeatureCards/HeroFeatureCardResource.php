<?php

namespace App\Filament\Resources\HeroFeatureCards;

use App\Filament\Resources\HeroFeatureCards\Pages\ManageHeroFeatureCards;
use App\Models\HeroFeatureCard;
use App\Support\CmsRecordDuplicator;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
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
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class HeroFeatureCardResource extends Resource
{
    protected static ?string $model = HeroFeatureCard::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'Hero Feature Cards';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Card Content')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('description')
                            ->rows(4)
                            ->maxLength(1000)
                            ->columnSpanFull(),
                        Select::make('icon_key')
                            ->options(HeroFeatureCard::ICONS)
                            ->default('default')
                            ->required(),
                        Select::make('style_variant')
                            ->options(HeroFeatureCard::STYLE_VARIANTS)
                            ->default('navy')
                            ->required(),
                    ])->columns(2),
                Section::make('Optional Media and Action')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Custom Icon/Image')
                            ->disk('public')
                            ->directory('homepage/hero-feature-cards')
                            ->image()
                            ->maxSize(2048),
                        TextInput::make('button_text')->maxLength(255),
                        TextInput::make('button_url')->maxLength(255),
                    ])->columns(2),
                Section::make('Display Rules')
                    ->schema([
                        TextInput::make('sort_order')
                            ->numeric()
                            ->minValue(0)
                            ->default(0)
                            ->required(),
                        Toggle::make('is_enabled')
                            ->default(true)
                            ->inline(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('icon_key')->badge()->sortable(),
                TextColumn::make('style_variant')->badge()->sortable(),
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
                    ->successNotificationTitle('Hero feature card duplicated as a disabled copy.')
                    ->action(fn (HeroFeatureCard $record): HeroFeatureCard => CmsRecordDuplicator::duplicate($record)),
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
            'index' => ManageHeroFeatureCards::route('/'),
        ];
    }
}
