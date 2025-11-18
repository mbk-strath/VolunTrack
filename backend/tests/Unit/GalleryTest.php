<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Gallery;
use App\Models\Organisation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GalleryTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function gallery_belongs_to_organisation()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $gallery = Gallery::factory()->create(['org_id' => $organisation->id]);

        $this->assertInstanceOf(Gallery::class, $gallery);
    }

    /** @test */
    public function gallery_can_be_created()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $gallery = Gallery::factory()->create([
            'org_id' => $organisation->id,
        ]);

        $this->assertInstanceOf(Gallery::class, $gallery);
        $this->assertNotNull($gallery->image_url);
    }
}
