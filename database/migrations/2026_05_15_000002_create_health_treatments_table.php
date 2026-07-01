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
        Schema::create('health_treatments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('generation_id')->constrained()->cascadeOnDelete();
            $table->date('date');

            $table->text('disease_description');
            
            // MODIFIÉ : Lien physique avec l'inventaire au lieu du texte libre
            $table->foreignId('item_id')->nullable()->constrained('items');
            $table->decimal('quantity', 10, 2)->nullable();
            $table->foreignId('unit_id')->nullable()->constrained('units');
            
            $table->string('veterinarian_name')->nullable();

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
        Schema::dropIfExists('health_treatments');
    }
};
