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
        // Création de la séquence PostgreSQL pour les commandes
        DB::statement('CREATE SEQUENCE IF NOT EXISTS sale_order_ref_seq START 1000');

        Schema::create('sale_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete(); // Isolation
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->date('order_date');
            $table->string('reference')->unique();
            $table->string('status')->default('draft');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sale_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('item_id')->constrained('items'); // Correction : Pointage vers l'entité physique
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_order_items');
        Schema::dropIfExists('sale_orders');
        DB::statement('DROP SEQUENCE IF EXISTS sale_order_ref_seq');
    }
};
