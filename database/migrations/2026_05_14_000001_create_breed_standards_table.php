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
        Schema::create('breed_standards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('breed_id')->constrained()->cascadeOnDelete();
            $table->integer('target_laying_start_age');
            $table->integer('target_culling_age');
            $table->decimal('peak_laying_rate', 5, 2);
            $table->decimal('target_daily_feed_intake', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('breed_standards');
    }
};
