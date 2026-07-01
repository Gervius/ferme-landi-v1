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
        DB::statement('CREATE SEQUENCE IF NOT EXISTS product_donation_ref_seq START 1000');

        Schema::create('product_donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete(); // Isolation
            $table->date('date');
            $table->string('reference')->unique(); // Ajout pour la traçabilité
            $table->string('beneficiary_name');
            $table->foreignId('item_id')->constrained('items'); // Correction physique
            $table->decimal('quantity', 10, 2);
            $table->decimal('valorization_price', 10, 2);

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
        Schema::dropIfExists('product_donations');
        DB::statement('DROP SEQUENCE IF EXISTS product_donation_ref_seq');
    }
};
