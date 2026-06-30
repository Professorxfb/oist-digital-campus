<?php

namespace App\Filament\Resources\Notices;

use App\Filament\Resources\Notices\Pages\ManageNotices;
use App\Models\Notice;
use App\Support\CmsRecordDuplicator;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
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
                Section::make('Main Notice Details')
                    ->schema([
                        TextInput::make('title')->required()->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->maxLength(255),
                        TextInput::make('category')->maxLength(255),
                        TextInput::make('audience')->maxLength(255),
                    ])->columns(2),
                Section::make('Body Content')
                    ->description('Use the rich editor for the main notice article. Inline body images upload to public notice content storage.')
                    ->schema([
                        RichEditor::make('body')
                            ->label('Rich Body')
                            ->fileAttachments(true)
                            ->fileAttachmentsDisk('public')
                            ->fileAttachmentsDirectory('cms/notices/content/body')
                            ->fileAttachmentsVisibility('public')
                            ->fileAttachmentsAcceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->fileAttachmentsMaxSize(4096)
                            ->helperText('Write formatted notice content here. Use the attachment and content block fields below for documents, videos, and extra media.')
                            ->columnSpanFull(),
                        Repeater::make('content_blocks')
                            ->label('Content / Media Blocks')
                            ->helperText('Optional repeatable blocks shown on the notice detail page in this order.')
                            ->schema([
                                Select::make('type')
                                    ->options([
                                        'rich_text' => 'Rich text block',
                                        'image' => 'Image block',
                                        'video' => 'Video URL / embed block',
                                        'attachment' => 'File attachment block',
                                        'link' => 'Button / link block',
                                    ])
                                    ->required()
                                    ->live(),
                                TextInput::make('title')
                                    ->label('Title or caption')
                                    ->maxLength(255),
                                RichEditor::make('body')
                                    ->label('Block rich text')
                                    ->visible(fn (Get $get): bool => $get('type') === 'rich_text')
                                    ->columnSpanFull(),
                                FileUpload::make('image_path')
                                    ->label('Image')
                                    ->disk('public')
                                    ->directory('cms/notices/content/images')
                                    ->visibility('public')
                                    ->image()
                                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                                    ->maxSize(4096)
                                    ->imagePreviewHeight('160')
                                    ->previewable()
                                    ->openable()
                                    ->downloadable()
                                    ->deletable()
                                    ->visible(fn (Get $get): bool => $get('type') === 'image'),
                                TextInput::make('video_url')
                                    ->label('Video URL')
                                    ->url()
                                    ->maxLength(2048)
                                    ->helperText('Use YouTube, Vimeo, or another public video URL. The frontend safely embeds supported URLs.')
                                    ->visible(fn (Get $get): bool => $get('type') === 'video'),
                                FileUpload::make('attachment_path')
                                    ->label('PDF / Word attachment')
                                    ->disk('public')
                                    ->directory('cms/notices/content/attachments')
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
                                    ->visible(fn (Get $get): bool => $get('type') === 'attachment'),
                                TextInput::make('button_text')
                                    ->label('Button / link label')
                                    ->maxLength(255)
                                    ->visible(fn (Get $get): bool => $get('type') === 'link'),
                                TextInput::make('button_url')
                                    ->label('Button / link URL')
                                    ->url()
                                    ->maxLength(2048)
                                    ->visible(fn (Get $get): bool => $get('type') === 'link'),
                            ])
                            ->default([])
                            ->columns(2)
                            ->collapsible()
                            ->cloneable()
                            ->reorderable()
                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? $state['type'] ?? null)
                            ->addActionLabel('Add content block')
                            ->columnSpanFull(),
                    ]),
                Section::make('Media & Links')
                    ->schema([
                        FileUpload::make('featured_image_path')
                            ->label('Featured Image')
                            ->helperText('Featured Image = the card/list image and the main image on the notice detail page.')
                            ->disk('public')
                            ->directory('cms/notices/images')
                            ->visibility('public')
                            ->image()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(4096)
                            ->imagePreviewHeight('180')
                            ->previewable()
                            ->openable()
                            ->downloadable()
                            ->deletable()
                            ->nullable(),
                        TextInput::make('external_link')
                            ->helperText('Optional related link shown as a button on the notice detail page.')
                            ->url()
                            ->maxLength(2048),
                        TextInput::make('video_url')
                            ->label('Video URL')
                            ->url()
                            ->maxLength(2048)
                            ->helperText('Video URL = YouTube/Vimeo/public video link. Supported URLs render as safe embeds on the detail page.'),
                    ])->columns(2),
                Section::make('Attachments')
                    ->description('Attachment = PDF/Word download file shown on the notice detail page.')
                    ->schema([
                        FileUpload::make('attachment_path')
                            ->label('Primary Attachment')
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
                            ->nullable()
                            ->columnSpanFull(),
                    ]),
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
                Action::make('duplicate')
                    ->label('Duplicate')
                    ->icon(Heroicon::Square2Stack)
                    ->color('gray')
                    ->requiresConfirmation()
                    ->modalDescription('Duplicate this record? The copy will be created as unpublished/disabled.')
                    ->successNotificationTitle('Notice duplicated as an unpublished copy.')
                    ->action(fn (Notice $record): Notice => CmsRecordDuplicator::duplicate($record)),
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
