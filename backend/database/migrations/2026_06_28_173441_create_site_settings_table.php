<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('institute_name')->nullable();
            $table->string('site_title')->nullable();
            $table->string('site_tagline')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('dark_logo_path')->nullable();
            $table->string('favicon_path')->nullable();
            $table->string('primary_phone')->nullable();
            $table->string('secondary_phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('google_map_url')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->text('footer_text')->nullable();
            $table->string('admission_cta_text')->nullable();
            $table->string('admission_cta_url')->nullable();
            $table->boolean('is_admission_open')->default(false)->index();
            $table->string('popup_notice_title')->nullable();
            $table->text('popup_notice_body')->nullable();
            $table->boolean('is_popup_notice_enabled')->default(false)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
