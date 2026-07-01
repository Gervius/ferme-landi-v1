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
        DB::statement('CREATE SEQUENCE IF NOT EXISTS customer_payment_ref_seq START 1000');

        Schema::create('customer_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete(); // Isolation stricte
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->date('payment_date');
            $table->string('reference')->unique();
            $table->decimal('amount', 12, 2);
            $table->string('payment_method');
            $table->text('notes')->nullable();

            $table->string('status')->default('draft');
            $table->foreignId('prepared_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_payments');
        DB::statement('DROP SEQUENCE IF EXISTS customer_payment_ref_seq');
    }
};
