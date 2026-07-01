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
        Schema::create('accounting_mappings', function (Blueprint $table) {
            $table->id();
            
            // Identifiant strict de l'événement (ex: 'customer_invoice', 'payroll')
            $table->string('event_type')->unique(); 
            $table->string('name'); 
            
            // Le journal cible
            $table->foreignId('accounting_journal_id')->constrained('accounting_journals');
            
            // Les comptes de la partie double (Créés dynamiquement par le client)
            $table->foreignId('debit_account_id')->constrained('accounts');
            $table->foreignId('credit_account_id')->constrained('accounts');

            // Optionnel : Pour lier automatiquement l'événement à une nature analytique (ex: Ventes)
            $table->foreignId('analytical_nature_id')->nullable()->constrained('analytical_natures');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting_mappings');
    }
};