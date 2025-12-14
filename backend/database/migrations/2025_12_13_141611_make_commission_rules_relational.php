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
        Schema::create('commission_rule_airport', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commission_rule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('airport_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['origin', 'destination']);
            $table->unique(['commission_rule_id', 'airport_id', 'type'], 'rule_airport_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commission_rule_airport');
    }
};
