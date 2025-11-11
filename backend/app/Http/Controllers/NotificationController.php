<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Databases
use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\Opportunity;
use App\Models\OtpCode;

//Resources
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use App\Mail\OtpEmail;
use App\Mail\PasswordResetEmail;
use App\Services\MembershipService;
use App\Models\Notification;

class NotificationController extends Controller
{
    
    public function list(Request $request)
    {
        $notification = Notification::all();
        return response()->json($notification);
    }


    public function create(Request $request){
        $data = $request->validate([
            'message' => 'required|string',
            'channel' => 'required|string',
            'receiver_id' => 'required|integer',
        ]);
        $data ['sender_id'] = $request->user()->id;
        $notification = Notification::create($data);
        return response()->json(["message"=>"message sent successfully","notification"=>$notification], 201);
    }


    public function myNotifications(Request $request)
    {
        \Log::info('myNotifications called');
        $user = $request->user();
        if (!$user) {
            \Log::info('User is null');
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        // Debug
        \Log::info('User ID: ' . $user->id . ', Role: ' . $user->role);
        
        // Get notifications received by the user
        $query = $user->receivedNotifications();
        \Log::info('Query: ' . $query->toSql());
        \Log::info('Bindings: ' . json_encode($query->getBindings()));
        $receivedNotifications = $query->get();
        
        \Log::info('Received notifications count: ' . $receivedNotifications->count());
        
        // Or get all notifications (both sent and received)
        $allNotifications = $user->notifications()->get();
        
        return response()->json([
            'received_notifications' => $receivedNotifications,
            'all_notifications' => $allNotifications
        ]);
    }

   
    public function unread(Request $request)
    {
        $user = $request->user();
        
        $unreadNotifications = $user->receivedNotifications()
                                   ->where('is_read', false)
                                   ->get();
        
        return response()->json($unreadNotifications);
    }


    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::find($id);
        
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        
        // Check if the notification belongs to the authenticated user
        if ($notification->receiver_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $notification->update([
            'is_read' => true,
            'read_at' => now()
        ]);
        
        return response()->json(['message' => 'Notification marked as read']);
    }
}