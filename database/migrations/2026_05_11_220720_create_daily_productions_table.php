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
            
            // Rapatrié ici pour l'index unique
            $table->foreignId('item_category_id')->nullable()->constrained('categories');
            
            $table->date('date');
            $table->foreignId('unit_id')->constrained();

            $table->decimal('good_quantity', 10, 2);
            $table->decimal('broken_quantity', 10, 2);
            $table->decimal('total_base_quantity', 10, 2)->default(0);

            // Workflow columns
            $table->string('status')->default('draft')->index(); // Indexé car on filtrera souvent les "draft" vs "approved"
            $table->foreignId('prepared_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            
            // Empêche la saisie de deux productions pour la même catégorie, la même génération, le même jour.
            $table->unique(['generation_id', 'date', 'item_category_id'], 'unique_daily_production');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_productions');
    }
};