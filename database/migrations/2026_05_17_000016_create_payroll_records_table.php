<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            
            // L'optimisation est ici : on remplace month/year par une date standard
            $table->date('period_start');
            
            $table->decimal('base_salary_snapshot', 10, 2);
            $table->decimal('deductions', 10, 2)->default(0);
            $table->text('deduction_reason')->nullable();
            $table->decimal('net_salary', 10, 2);

            // Workflow
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
        Schema::dropIfExists('payroll_records');
    }
};