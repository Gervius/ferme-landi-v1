<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            
            // Clés étrangères
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            
            // Données personnelles et professionnelles
            $table->string('first_name');
            $table->string('last_name');
            $table->string('position'); // Ajouté
            $table->date('hire_date'); // Ajouté
            
            // Paie et Statut
            $table->decimal('base_salary', 10, 2);
            $table->boolean('is_active')->default(true);
            
            // Audit trails
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};