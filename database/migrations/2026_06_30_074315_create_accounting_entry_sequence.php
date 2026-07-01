<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Création d'une séquence démarrant à 1
        DB::statement('CREATE SEQUENCE IF NOT EXISTS accounting_entry_ref_seq START 1');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP SEQUENCE IF EXISTS accounting_entry_ref_seq');
    }
};