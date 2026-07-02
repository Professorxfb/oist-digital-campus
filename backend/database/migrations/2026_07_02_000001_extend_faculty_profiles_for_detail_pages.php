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
        Schema::table('faculty_profiles', function (Blueprint $table) {
            $table->text('detailed_bio')->nullable()->after('short_bio');
            $table->text('qualifications')->nullable()->after('detailed_bio');
            $table->text('research_interests')->nullable()->after('qualifications');
            $table->text('expertise')->nullable()->after('research_interests');
            $table->string('office_location')->nullable()->after('phone');
            $table->string('facebook_url', 2048)->nullable()->after('office_location');
            $table->string('linkedin_url', 2048)->nullable()->after('facebook_url');
            $table->string('twitter_url', 2048)->nullable()->after('linkedin_url');
            $table->string('website_url', 2048)->nullable()->after('twitter_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faculty_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'detailed_bio',
                'qualifications',
                'research_interests',
                'expertise',
                'office_location',
                'facebook_url',
                'linkedin_url',
                'twitter_url',
                'website_url',
            ]);
        });
    }
};
