<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Organisation;
use App\Models\Opportunity;
use App\Models\Report;
use App\Models\Gallery;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrganisationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function organisation_has_correct_fillable_attributes()
    {
        $organisation = new Organisation();

                $expectedFillable = [
            'id',
            'user_id',
            'org_name',
            'org_type',
            'registration_number',
            'email',
            'phone',
            'website',
            'logo',
            'country',
            'city',
            'street_address',
            'operating_region',
            'mission_statement',
            'focus_area',
            'target_beneficiary',
        ];

        $this->assertEquals($expectedFillable, $organisation->getFillable());
    }

    /** @test */
    public function organisation_has_correct_casts()
    {
        $organisation = new Organisation();

        $expectedCasts = [
            'id' => 'int',
        ];

        $this->assertEquals($expectedCasts, $organisation->getCasts());
    }

    /** @test */
    public function organisation_belongs_to_user()
    {
        $user = User::factory()->create();
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $organisation->user);
        $this->assertEquals($user->id, $organisation->user->id);
    }

    /** @test */
    public function organisation_has_many_opportunities()
    {
        $organisation = Organisation::factory()->create();
        $opportunities = Opportunity::factory()->count(3)->create(['organisation_id' => $organisation->id]);

        $this->assertCount(3, $organisation->opportunities);
        $organisation->opportunities->each(function ($opportunity) use ($organisation) {
            $this->assertEquals($organisation->id, $opportunity->organisation_id);
        });
    }

    /** @test */
    public function organisation_has_many_gallery_images()
    {
        $organisation = Organisation::factory()->create();
        $gallery = Gallery::factory()->count(2)->create(['org_id' => $organisation->id]);

        $this->assertCount(2, $organisation->gallery);
        $organisation->gallery->each(function ($item) use ($organisation) {
            $this->assertEquals($organisation->id, $item->org_id);
        });
    }
}