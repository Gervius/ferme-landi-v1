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
        
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained('sites')->restrictOnDelete();
            $table->foreignId('item_id')->constrained('items')->restrictOnDelete(); // Remplacement de category_id
            $table->foreignId('unit_id')->constrained('units')->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            
            $table->string('type', 20); // 'in', 'out', 'adjustment'
            $table->decimal('quantity', 12, 2);
            $table->date('date');
            
            // Pour lier le mouvement à une Facture (Invoice), un Ordre d'Achat, etc.
            $table->nullableMorphs('reference');
            
            $table->text('notes')->nullable();
            $table->timestamps();

            // INDEX DE PERFORMANCE : Optimise massivement le "orderByDesc('date')" couplé au filtrage par site/article
            $table->index(['site_id', 'item_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
