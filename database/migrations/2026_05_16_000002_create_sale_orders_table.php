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
        Schema::create('sale_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->date('order_date');
            $table->string('reference')->unique();
            $table->string('status')->default('draft'); // draft, validated, partially_delivered, delivered, closed
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sale_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('unit_id')->constrained();
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_order_items');
        Schema::dropIfExists('sale_orders');
    }
};
