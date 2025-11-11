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
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organisation_id')->constrained('organisations')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->text('required_skills');
            $table->integer('num_volunteers_needed');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('schedule');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('benefits')->nullable();
            $table->date('application_deadline');
            $table->boolean('cv_required')->default(false);
            $table->string('location');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
