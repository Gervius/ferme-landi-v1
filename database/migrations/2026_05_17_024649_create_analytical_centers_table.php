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
        Schema::create('analytical_centers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('analytical_nature_id')->constrained('analytical_natures');
            $table->foreignId('analytical_code_id')->constrained('analytical_codes');
            $table->string('short_name');
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['analytical_nature_id', 'analytical_code_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytical_centers');
    }
};
