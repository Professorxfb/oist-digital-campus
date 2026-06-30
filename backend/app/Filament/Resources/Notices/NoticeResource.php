<?php

namespace App\Filament\Resources\Notices;

use App\Filament\Resources\Notices\Pages\ManageNotices;
use App\Models\Notice;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
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

class NoticeResource extends Resource
{
    protected static ?string $model = Notice::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Public CMS';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Notice')
                    ->schema([
                        TextInput::make('title')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        TextInput::make('category')->maxLength(255),
                        TextInput::make('audience')->maxLength(255),
                        RichEditor::make('body')->columnSpanFull(),
                    ])->columns(2),
                Section::make('Media and Links')
                    ->schema([
                        FileUpload::make('featured_image_path')
                            ->label('Featured Image')
                            ->disk('public')
                            ->directory('cms/notices/images')
                            ->visibility('public')
                            ->image()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                            ->maxSize(4096)
                            ->imagePreviewHeight('180')
                            ->previewable()
                            ->openable()
                            ->downloadable()
                            ->deletable()
                            ->nullable(),
                        FileUpload::make('attachment_path')
                            ->label('Attachment')
                            ->disk('public')
                            ->directory('cms/notices/attachments')
                            ->visibility('public')
                            ->acceptedFileTypes([
                                'application/pdf',
                                'application/msword',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            ])
                            ->maxSize(10240)
                            ->previewable()
                            ->openable()
                            ->downloadable()
                            ->deletable()
                            ->nullable(),
                        TextInput::make('external_link')
                            ->url()
                            ->maxLength(2048),
                        TextInput::make('video_url')
                            ->label('Video URL')
                            ->url()
                            ->maxLength(2048)
                            ->helperText('Use a public video URL such as YouTube when a notice needs a video reference.'),
                    ])->columns(2),
                Section::make('Publishing')
                    ->schema([
                        Toggle::make('is_pinned')->inline(false),
                        Toggle::make('is_published')->inline(false),
                        DateTimePicker::make('published_at'),
                        DateTimePicker::make('expires_at'),
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
                TextColumn::make('category')->placeholder('Not set')->searchable(),
                TextColumn::make('audience')->placeholder('Not set')->searchable(),
                TextColumn::make('external_link')->label('External Link')->placeholder('Not set')->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('video_url')->label('Video')->placeholder('Not set')->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('is_pinned')->boolean()->sortable(),
                IconColumn::make('is_published')->boolean()->sortable(),
                TextColumn::make('published_at')->dateTime()->sortable(),
                TextColumn::make('expires_at')->dateTime()->sortable(),
                TextColumn::make('sort_order')->numeric()->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_pinned'),
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
            'index' => ManageNotices::route('/'),
        ];
    }
}
