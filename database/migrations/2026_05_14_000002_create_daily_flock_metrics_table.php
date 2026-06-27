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
        Schema::create('daily_flock_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('generation_id')->constrained()->cascadeOnDelete();
            $table->date('date');

            $table->integer('live_quantity');
            $table->decimal('eggs_produced', 10, 2)->default(0);
            $table->decimal('feed_consumed', 10, 2)->default(0);
            $table->integer('mortality_count')->default(0);

            $table->decimal('laying_rate', 5, 2)->default(0);
            $table->decimal('feed_conversion_ratio', 8, 2)->default(0);

            $table->unique(['generation_id', 'date']);
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_flock_metrics');
    }
};
