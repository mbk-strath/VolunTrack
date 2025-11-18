<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function report_can_be_created()
    {
        $user = User::factory()->create();
        $report = Report::factory()->create([
            'user_id' => $user->id,
            'title' => 'Test Report',
            'description' => 'Test bug report',
            'status' => 'pending',
        ]);

        $this->assertInstanceOf(Report::class, $report);
        $this->assertEquals('Test Report', $report->title);
        $this->assertEquals('Test bug report', $report->description);
    }

    /** @test */
    public function report_belongs_to_user()
    {
        $user = User::factory()->create();
        $report = Report::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $report->user);
        $this->assertEquals($user->id, $report->user->id);
    }
}
