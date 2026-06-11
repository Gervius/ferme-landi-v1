<?php

use App\Enums\GenerationStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generations', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->foreignId('breed_id')->constrained()->cascadeOnDelete();
            
            $table->string('code')->unique(); 
            $table->string('type')->index(); 
            $table->date('start_date');
            
            
            $table->unsignedInteger('initial_quantity');
            $table->unsignedInteger('current_quantity');
            
            $table->string('status')->default(GenerationStatus::ACTIF->value)->index();
            $table->text('observation')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generations');
    }
};