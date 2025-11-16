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
        Schema::table('notifications', function (Blueprint $table) {
            // Drop the old foreign key constraints
            $table->dropForeign(['receiver_id']);
            $table->dropForeign(['sender_id']);
            
            // Modify columns to NOT nullable and re-add constraints with cascade delete
            $table->foreignId('receiver_id')->change()->constrained('users')->cascadeOnDelete();
            $table->foreignId('sender_id')->change()->constrained('users')->cascadeOnDelete();
            
            // Add index for better query performance
            $table->index('receiver_id');
            $table->index('sender_id');
            $table->index(['receiver_id', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['receiver_id']);
            $table->dropForeign(['sender_id']);
            $table->dropIndex(['receiver_id']);
            $table->dropIndex(['sender_id']);
            $table->dropIndex(['receiver_id', 'is_read']);
            
            $table->foreignId('receiver_id')->nullable()->change()->constrained('users')->nullOnDelete();
            $table->foreignId('sender_id')->nullable()->change()->constrained('users')->nullOnDelete();
        });
    }
};
