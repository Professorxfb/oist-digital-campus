<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_feature_cards', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon_key')->default('default');
            $table->string('image_path')->nullable();
            $table->string('style_variant')->default('navy');
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->index(['is_enabled', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_feature_cards');
    }
};
