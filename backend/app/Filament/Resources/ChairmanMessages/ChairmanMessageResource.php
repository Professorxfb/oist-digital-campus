<?php

namespace App\Filament\Resources\ChairmanMessages;

use App\Filament\Resources\ChairmanMessages\Pages\ManageChairmanMessages;
use App\Models\ChairmanMessage;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
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

class ChairmanMessageResource extends Resource
{
    protected static ?string $model = ChairmanMessage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    protected static ?string $navigationLabel = 'Chairman Message';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Message Content')
                    ->schema([
                        TextInput::make('title')->maxLength(255),
                        TextInput::make('subtitle')
                            ->label('Subtitle / Eyebrow')
                            ->maxLength(255),
                        TextInput::make('quote_label')->maxLength(255),
                        RichEditor::make('message')
                            ->label('Message / Body')
                            ->columnSpanFull(),
                    ])->columns(2),
                Section::make('Chairman Details')
                    ->schema([
                        TextInput::make('chairman_name')->maxLength(255),
                        TextInput::make('chairman_designation')->maxLength(255),
                        FileUpload::make('chairman_image_path')
                            ->label('Chairman Image')
                            ->disk('public')
                            ->directory('cms/chairman-message')
                            ->visibility('public')
                            ->image()
                            ->maxSize(4096),
                        FileUpload::make('signature_image_path')
                            ->label('Signature Image')
                            ->disk('public')
                            ->directory('cms/chairman-message/signatures')
                            ->visibility('public')
                            ->image()
                            ->maxSize(2048),
                    ])->columns(2),
                Section::make('Optional Action')
                    ->schema([
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
                        Toggle::make('is_published')
                            ->default(true)
                            ->inline(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->placeholder('Not set')->searchable()->sortable(),
                TextColumn::make('chairman_name')->placeholder('Not set')->searchable()->sortable(),
                TextColumn::make('chairman_designation')->placeholder('Not set')->searchable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->filters([
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
            'index' => ManageChairmanMessages::route('/'),
        ];
    }
}
