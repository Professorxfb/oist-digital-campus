<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_applications', function (Blueprint $table): void {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->index();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->string('country')->nullable()->index();
            $table->string('city')->nullable()->index();
            $table->string('zip_code')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('message')->nullable();
            $table->string('preferred_program')->nullable();
            $table->string('status')->default('new')->index();
            $table->text('notes')->nullable();
            $table->string('source')->default('homepage_admissions_section')->index();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admission_applications');
    }
};
