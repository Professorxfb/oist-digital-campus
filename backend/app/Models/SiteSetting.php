<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'institute_name',
        'site_title',
        'site_tagline',
        'meta_title',
        'meta_description',
        'logo_path',
        'dark_logo_path',
        'favicon_path',
        'primary_phone',
        'secondary_phone',
        'email',
        'address',
        'google_map_url',
        'facebook_url',
        'youtube_url',
        'linkedin_url',
        'whatsapp_number',
        'footer_text',
        'admission_cta_text',
        'admission_cta_url',
        'is_admission_open',
        'popup_notice_title',
        'popup_notice_body',
        'is_popup_notice_enabled',
    ];

    protected function casts(): array
    {
        return [
            'is_admission_open' => 'boolean',
            'is_popup_notice_enabled' => 'boolean',
        ];
    }
}
