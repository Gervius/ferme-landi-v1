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
        DB::statement('CREATE SEQUENCE IF NOT EXISTS delivery_note_ref_seq START 1000');

        Schema::create('delivery_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete(); // Isolation
            $table->foreignId('sale_order_id')->nullable()->constrained()->nullOnDelete();
            $table->date('delivery_date');
            $table->string('reference')->unique();

            $table->string('status')->default('draft');
            $table->foreignId('prepared_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('delivery_note_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_note_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sale_order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('item_id')->constrained('items'); // Correction physique
            $table->decimal('delivered_quantity', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_note_items');
        Schema::dropIfExists('delivery_notes');
        DB::statement('DROP SEQUENCE IF EXISTS delivery_note_ref_seq');
    }
};
