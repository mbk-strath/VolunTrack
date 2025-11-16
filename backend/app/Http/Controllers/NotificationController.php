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
        // Only admins can view all notifications
        if ($request->user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can view all notifications'], 403);
        }

        $notifications = Notification::paginate(15);
        return response()->json($notifications);
    }


    public function create(Request $request){
        // Check if user has permission to send notifications (admin or organisation)
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'organisation') {
            return response()->json(['error' => 'Only admins and organisations can send notifications'], 403);
        }

        $data = $request->validate([
            'message' => 'required|string',
            'channel' => 'required|string|in:email,in_app,sms',
            'receiver_id' => 'required|integer|exists:users,id',
        ]);
        
        $data['sender_id'] = $user->id;
        $notification = Notification::create($data);
        return response()->json(["message"=>"message sent successfully","notification"=>$notification], 201);
    }


    public function myNotifications(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        // Get only notifications received by the user with pagination
        $receivedNotifications = $user->receivedNotifications()
                                     ->latest('sent_at')
                                     ->paginate(15);
        
        return response()->json($receivedNotifications);
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