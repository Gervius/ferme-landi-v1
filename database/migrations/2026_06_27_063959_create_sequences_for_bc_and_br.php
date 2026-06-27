<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        
        DB::statement('CREATE SEQUENCE IF NOT EXISTS purchase_order_ref_seq START 1');
        DB::statement('CREATE SEQUENCE IF NOT EXISTS purchase_receipt_ref_seq START 1');
    }

    public function down(): void
    {
        DB::statement('DROP SEQUENCE IF EXISTS purchase_order_ref_seq');
        DB::statement('DROP SEQUENCE IF EXISTS purchase_receipt_ref_seq');
    }
};