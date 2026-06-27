<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            
            // Clés étrangères optimisées
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('default_unit_id')->constrained('units')->restrictOnDelete();
            
            $table->string('name');
            
            // Flags stratégiques (Booléens très légers en RAM)
            $table->boolean('is_perishable')->default(false)->comment('Vrai pour vaccins, aliments frais, etc.');
            $table->boolean('manage_by_batch')->default(false)->comment('Préparation pour la future traçabilité des lots');
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes(); // Aligné avec le comportement de Category

            // Index pour accélérer les recherches sur l'UI (Zero-Latency UI)
            $table->index(['category_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};