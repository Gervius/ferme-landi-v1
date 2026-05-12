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
        Schema::create('product_donations', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('beneficiary_name');
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('unit_id')->constrained();
            $table->decimal('quantity', 10, 2);
            $table->decimal('valorization_price', 10, 2);

            // Workflow columns
            $table->string('status')->default('draft');
            $table->foreignId('prepared_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_donations');
    }
};
