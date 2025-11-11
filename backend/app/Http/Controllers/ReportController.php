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
        if ($request->user()->role == 'admin' ){
            return response()->json($report);
        }
        if ($report->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($report);
    }

    public function create(Request $request){
        $report = Report::create([
            'user_id' => $request->user()->id,
            'title' => $request->input('title'),    
            'description' => $request->input('description') ?? null,
        ]);
        return response()->json($report);
    }

    public function update(Request $request, $id){
        $report = Report::find($id);
        if(!$report){
            return response()->json(['message' => 'Report not found'], 404);
        }
        $report->update($request->only(['title', 'description']));
        return response()->json($report);
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
