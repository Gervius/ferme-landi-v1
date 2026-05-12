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
        Schema::create('prophylaxis_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prophylaxis_program_id')->constrained()->cascadeOnDelete();
            $table->integer('day_offset');
            $table->foreignId('medication_category_id')->constrained('categories');
            $table->text('description')->nullable();
            $table->integer('alert_days_before')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prophylaxis_steps');
    }
};
