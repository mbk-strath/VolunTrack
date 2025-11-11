<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Organisation;
use App\Models\Opportunity;
use App\Models\Application;
use App\Models\Participation;
use App\Models\Gallery;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OpportunityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function opportunity_has_correct_fillable_attributes()
    {
        $opportunity = new Opportunity();

        $expectedFillable = [
            'id',
            'organisation_id',
            'title',
            'description',
            'required_skills',
            'num_volunteers_needed',
            'start_date',
            'end_date',
            'schedule',
            'location',
            'benefits',
            'application_deadline',
        ];

        $this->assertEquals($expectedFillable, $opportunity->getFillable());
    }

    /** @test */
    public function opportunity_has_correct_casts()
    {
        $opportunity = new Opportunity();

        $expectedCasts = [
            'id' => 'int',
            'start_date' => 'date',
            'end_date' => 'date',
            'application_deadline' => 'date',
        ];

        $this->assertEquals($expectedCasts, $opportunity->getCasts());
    }

    /** @test */
    public function opportunity_belongs_to_organisation()
    {
        $organisation = Organisation::factory()->create();
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);

        $this->assertInstanceOf(Organisation::class, $opportunity->organisation);
        $this->assertEquals($organisation->id, $opportunity->organisation->id);
    }

    /** @test */
    public function opportunity_has_many_applications()
    {
        $opportunity = Opportunity::factory()->create();
        $applications = Application::factory()->count(3)->create(['opportunity_id' => $opportunity->id]);

        $this->assertCount(3, $opportunity->applications);
        $opportunity->applications->each(function ($application) use ($opportunity) {
            $this->assertEquals($opportunity->id, $application->opportunity_id);
        });
    }

    /** @test */
    public function opportunity_has_many_participations()
    {
        $opportunity = Opportunity::factory()->create();
        $participations = Participation::factory()->count(2)->create(['opportunity_id' => $opportunity->id]);

        $this->assertCount(2, $opportunity->participations);
        $opportunity->participations->each(function ($participation) use ($opportunity) {
            $this->assertEquals($opportunity->id, $participation->opportunity_id);
        });
    }

    /** @test */
    public function opportunity_has_many_gallery_images()
    {
        $opportunity = Opportunity::factory()->create();
        $gallery = Gallery::factory()->count(2)->create(['org_id' => $opportunity->organisation_id]);

        $this->assertCount(2, $opportunity->gallery);
        $opportunity->gallery->each(function ($item) use ($opportunity) {
            $this->assertEquals($opportunity->organisation_id, $item->org_id);
        });
    }

    /** @test */
    public function opportunity_attendance_rate_attribute()
    {
        $opportunity = Opportunity::factory()->create(['num_volunteers_needed' => 10]);
        Application::factory()->count(10)->create(['opportunity_id' => $opportunity->id]);
        Participation::factory()->count(6)->create(['opportunity_id' => $opportunity->id]);

        $opportunity->refresh();

        $this->assertEquals(60, $opportunity->attendance_rate);
    }

    /** @test */
    public function opportunity_has_correct_appended_attributes()
    {
        $opportunity = new Opportunity();

        $expectedAppends = [
            'attendance_rate'
        ];

        $this->assertEquals($expectedAppends, $opportunity->getAppends());
    }
}