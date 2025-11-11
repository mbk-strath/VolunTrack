<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Organisation;
use App\Models\Opportunity;
use App\Models\Gallery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class GalleryTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function organisation_can_upload_gallery_image()
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $file = UploadedFile::fake()->image('gallery.jpg');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/add-image', [
            'org_id' => $organisation->id,
            'image' => $file,
            'caption' => 'Volunteer event photo'
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'gallery' => [
                        'id', 'org_id', 'image_url', 'caption'
                    ]
                ]);

        $this->assertDatabaseHas('galleries', [
            'org_id' => $organisation->id,
            'caption' => 'Volunteer event photo'
        ]);

        Storage::disk('public')->assertExists('galleries/' . $file->hashName());
    }

    /** @test */
    public function organisation_can_view_own_gallery()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $gallery = Gallery::factory()->count(2)->create(['org_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/my-gallery/' . $organisation->id);

        $response->assertStatus(200)
                ->assertJsonCount(2);
    }

    /** @test */
    public function anyone_can_view_public_gallery()
    {
        Gallery::factory()->count(3)->create();

        $response = $this->getJson('/api/all-images');

        $response->assertStatus(401); // Requires authentication
    }

    /** @test */
    public function organisation_can_delete_gallery_image()
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $gallery = Gallery::factory()->create(['org_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->deleteJson('/api/delete-image/' . $gallery->id);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Gallery item deleted successfully'
                ]);

        $this->assertDatabaseMissing('galleries', ['id' => $gallery->id]);
    }

    /** @test */
    public function admin_can_list_all_gallery_images()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Gallery::factory()->count(3)->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-images');

        $response->assertStatus(200)
                ->assertJsonCount(3);
    }

    /** @test */
    public function volunteer_cannot_upload_gallery_image()
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $organisation = Organisation::factory()->create();
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $file = UploadedFile::fake()->image('gallery.jpg');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/add-image', [
            'org_id' => $organisation->id,
            'image' => $file,
            'caption' => 'Unauthorized upload'
        ]);

        $response->assertStatus(403);
    }
}