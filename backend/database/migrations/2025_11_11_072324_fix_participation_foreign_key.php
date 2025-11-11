<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('participations', function (Blueprint $table) {
            $table->dropForeign(['volunteer_id']);
            $table->foreign('volunteer_id')->references('id')->on('volunteers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participations', function (Blueprint $table) {
            $table->dropForeign(['volunteer_id']);
            $table->foreign('volunteer_id')->references('id')->on('users')->onDelete('set null');
        });
    }
};
