<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_productions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('generation_id')->constrained()->cascadeOnDelete();
            
            // MODIFIÉ : Pointeur physique vers l'article (ex: "Plateau de 30 œufs")
            $table->foreignId('item_id')->nullable()->constrained('items');
            
            $table->date('date');
            $table->foreignId('unit_id')->constrained();

            $table->decimal('good_quantity', 10, 2);
            $table->decimal('broken_quantity', 10, 2);
            $table->decimal('total_base_quantity', 10, 2)->default(0);

            $table->string('status')->default('draft')->index();
            $table->foreignId('prepared_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // MODIFIÉ : L'unicité se fait sur l'item
            $table->unique(['generation_id', 'date', 'item_id'], 'unique_daily_production');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_productions');
    }
};