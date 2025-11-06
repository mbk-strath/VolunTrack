<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Databases
use App\Models\Gallery;
use App\Models\Organisation;


//Resources


class GalleryController extends Controller
{
    public function list()
    {
        $galleries = Gallery::all();
        return response()->json($galleries);
    }

    public function myGallery(Request $request, string $id)
    {
        $gallery = Gallery::where('org_id', $id)->get();
        return response()->json($gallery);
    }

    public function getImage($id)
    {
        $gallery = Gallery::find($id);
        if (!$gallery) {
            return response()->json(['message' => 'Gallery item not found'], 404);
        }
        return response()->json($gallery);
    }


    public function addImage(Request $request)
    {
        $request->validate([
            'org_id' => 'required|integer',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            'caption' => 'nullable|string|max:255',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('galleries', 'public');
        }

        $gallery = new Gallery();
        $gallery->org_id = $request->input('org_id');
        $gallery->image_url = $imagePath ? asset('storage/' . $imagePath) : null;
        $gallery->caption = $request->input('caption');
        $gallery->uploaded_at = now();
        $gallery->save();

        return response()->json(['message' => 'Gallery item added successfully', 'gallery' => $gallery], 201);
    }


    public function updateImage(Request $request, string $id)
    {
        $gallery = Gallery::find($id);
        if (!$gallery) {
            return response()->json(['message' => 'Gallery item not found'], 404);
        }

        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'caption' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($gallery->image_url) {
                $oldPath = str_replace(asset('storage/'), '', $gallery->image_url);
                \Storage::disk('public')->delete($oldPath);
            }
            $imagePath = $request->file('image')->store('galleries', 'public');
            $gallery->image_url = asset('storage/' . $imagePath);
        }

        $gallery->caption = $request->input('caption', $gallery->caption);
        $gallery->save();

        return response()->json(['message' => 'Gallery item updated successfully', 'gallery' => $gallery]);
    }


    public function deleteImage(Request $request, string $id)
    {
        $gallery = Gallery::find($id);
        if (!$gallery) {
            return response()->json(['message' => 'Gallery item not found'], 404);  
        }

        // Delete the image file
        if ($gallery->image_url) {
            $imagePath = str_replace(asset('storage/'), '', $gallery->image_url);
            \Storage::disk('public')->delete($imagePath);
        }

        $gallery->delete();
        return response()->json(['message' => 'Gallery item deleted successfully']);
    }
}
