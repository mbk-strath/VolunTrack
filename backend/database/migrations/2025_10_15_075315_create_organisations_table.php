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
            $table->string('org_name');
            $table->string('org_type');
            $table->string('registration_number')->unique();
            $table->string('email');
            $table->string('phone');
            $table->string('website')->nullable();
            $table->string('logo')->nullable();
            $table->string('country');
            $table->string('city');
            $table->string('street_address');
            $table->string('operating_region');
            $table->string('mission_statement')->nullable();
            $table->string('focus_area');
            $table->string('target_beneficiary');
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
