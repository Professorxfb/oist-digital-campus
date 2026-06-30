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
        Schema::table('notices', function (Blueprint $table): void {
            $table->string('featured_image_path')->nullable()->after('body');
            $table->text('external_link')->nullable()->after('attachment_path');
            $table->text('video_url')->nullable()->after('external_link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notices', function (Blueprint $table): void {
            $table->dropColumn([
                'featured_image_path',
                'external_link',
                'video_url',
            ]);
        });
    }
};
