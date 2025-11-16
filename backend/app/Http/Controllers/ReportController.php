<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


//Databases
use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\Report;

//Resources
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Services\MembershipService;
use Carbon\Carbon;


class ReportController extends Controller
{
    public function list(){
        $reports = Report::all();
        return response()->json($reports);
    }

    public function get($id){
        $report = Report::find($id);
        if(!$report){
            return response()->json(['message' => 'Report not found'], 404);
        }
        $user = $request->user();
        if ($user->role === 'admin' || $report->user_id === $user->id) {
            return response()->json($report);
        }
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function create(Request $request){
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        
        $report = Report::create([
            'user_id' => $request->user()->id,
            'title' => $data['title'],    
            'description' => $data['description'] ?? null,
            'status' => 'pending',
        ]);
        return response()->json($report, 200);
    }

    public function update(Request $request, $id){
        $report = Report::find($id);
        if(!$report){
            return response()->json(['message' => 'Report not found'], 404);
        }
        
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);
        
        $report->update($data);
        return response()->json($report, 200);
    }
    
    public function delete($id){
        $report = Report::find($id);
        if(!$report){
            return response()->json(['message' => 'Report not found'], 404);
        }
        $report->delete();
        return response()->json(['message' => 'Report deleted successfully']);
    }
    public function MyReports(Request $request){
        $user = $request->user();
        $reports = Report::where('user_id', $user->id)->get();
        return response()->json($reports);
    }
    public function UpdateStatus(Request $request, $id){
        $report = Report::find($id);
        if(!$report){
            return response()->json(['message' => 'Report not found'], 404);
        }
        $report->update($request->only(['status']));
        return response()->json($report);
    }
}   
