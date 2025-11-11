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
        Schema::create('organisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('org_name')->nullable();
            $table->string('org_type')->nullable();
            $table->string('reg_no')->nullable()->unique();
            $table->string('website')->nullable();
            $table->string('logo')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('focus_area')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organisations');
    }
};
