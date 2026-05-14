<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->nullable()->constrained()->nullOnDelete();
            $table->date('receipt_date');
            $table->string('reference')->unique();

            // Workflow columns
            $table->string('status')->default('draft');
            $table->foreignId('prepared_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('purchase_receipt_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_receipt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('unit_id')->constrained();
            $table->decimal('received_quantity', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_receipt_items');
        Schema::dropIfExists('purchase_receipts');
    }
};
