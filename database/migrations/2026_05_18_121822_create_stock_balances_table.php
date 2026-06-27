<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained('sites')->restrictOnDelete();
            $table->foreignId('item_id')->constrained('items')->restrictOnDelete(); // Remplacement de category_id
            $table->foreignId('unit_id')->constrained('units')->restrictOnDelete();
            
            // Utilisation d'un decimal suffisamment large pour les pesées et tonnages
            $table->decimal('quantity', 12, 2)->default(0);
            $table->timestamps();

            // LE VERROU ABSOLU : Empêche la création de lignes dupliquées concurrentes
            $table->unique(['site_id', 'item_id', 'unit_id']);
        });

        DB::statement('ALTER TABLE stock_balances ADD CONSTRAINT check_quantity_positive CHECK (quantity >= 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_balances');
    }
};
