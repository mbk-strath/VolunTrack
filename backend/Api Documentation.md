API Endpoints
Base URL: http://localhost:8000/api/

## Authentication & Authorization

This API uses Laravel Sanctum for authentication. All protected endpoints require a Bearer token in the Authorization header.

**Authentication Flow:**

1. Register/Login to get an access token
2. Include token in requests: `Authorization: Bearer {token}`

**Role-Based Access:**

-   **Admin**: Full access to all endpoints
-   **Organisation**: Access to organisation-specific endpoints and general endpoints
-   **Volunteer**: Access to volunteer-specific endpoints and general endpoints

**Middleware Groups:**

-   `auth:sanctum`: Requires authentication
-   `role:admin`: Admin only
-   `role:admin,organisation`: Admin or Organisation
-   `role:admin,volunteer`: Admin or Volunteer
-   `role:admin,organisation,volunteer`: All authenticated users

**Common HTTP Status Codes:**

-   `200`: Success
-   `201`: Created
-   `400`: Bad Request (validation errors)
-   `401`: Unauthorized (invalid/missing token)
-   `403`: Forbidden (insufficient permissions)
-   `404`: Not Found
-   `422`: Unprocessable Entity (validation failed)
-   `500`: Internal Server Error

---

## Get Authenticated User

**Endpoint:** `GET /user`

**Headers:**

-   Authorization: Bearer {token}

**Response:**

```
{
    "id": 1,
    "name": "peter",
    "email": "ramadhan.abdilatif@strathmore.edu",
    "role": "volunteer",
    ...
}
```

---

## Register

**Endpoint:** `POST /register`

**Content-Type:** `multipart/form-data` (for file uploads)

**Body Parameters:**

-   name (string, required)
-   email (string, required)
-   password (string, required)
-   role (string, required: organisation|volunteer|admin)
-   phone (string, optional)
-   gender (string, optional)

**Response:**

```
{
	"user": {
		"id": 1,
		"name": "peter",
		"email": "ramadhan.abdilatif@strathmore.edu",
		"role": "volunteer",
		...
	},
	"message": "Registration successful. Please check your email for verification instructions."
}
```

---

## Verify User

**Endpoint:** `GET /verify/{id}`

**Response:**

```
{
	"message": "User verified successfully"
}
```

---

## Login

**Endpoint:** `POST /login`

**Body Parameters:**

-   email (string, required)
-   password (string, required)

**Response:**

-   If not verified:
    ```
    {
    	"message": "Account is not verified. Please check your email for verification instructions."
    }
    ```
-   If verified and role is admin:
    ```
    {
    	"user": {
    		"id": 1,
    		"name": "admin",
    		"email": "admin@example.com",
    		"role": "admin",
    		...
    	},
    	"token": "1|JhOoeFmAlQf6rvXbOJYl4IcsqWxfQyO2MhCbUCo9422c6ea7"
    }
    ```
-   If verified and role is organisation/volunteer:
    ```
    {
    	"message": "OTP sent to email"
    }
    ```

---

## Verify OTP

**Endpoint:** `POST /verify-otp`

**Body Parameters:**

-   otp (string, required)

**Response:**

-   If wrong/expired OTP:
    ```
    {
    	"message": "Invalid or expired OTP"
    }
    ```
-   If correct OTP:
    ```
    {
    	"user": {
    		"id": 1,
    		"name": "peter",
    		"email": "ramadhan.abdilatif@strathmore.edu",
    		...
    	},
    	"token": "1|JhOoeFmAlQf6rvXbOJYl4IcsqWxfQyO2MhCbUCo9422c6ea7",
    	"membership"{
    		either organisation data or volunteer data
    	}
    }
    ```

---

## Password Reset (Request OTP)

**Endpoint:** `POST /reset-otp`

**Body Parameters:**

-   email (string, required)

**Response:**

```
{
	"message": "OTP sent to your email. Please verify to proceed."
}
```

---

## Password Reset (Set New Password)

**Endpoint:** `POST /reset-password`

**Body Parameters:**

-   otp (string, required)
-   new_password (string, required)

**Response:**

```
{
	"message": "Password reset successful"
}
```

---

## Logout

**Endpoint:** `POST /logout`

**Headers:**

-   Authorization: Bearer {token}

**Response:**

```
{
	"message": "Logged out"
}
```

---

## Show Membership

**Endpoint:** `GET /get/{id}`

**Path Parameters:**

-   id (integer, required): The user ID

**Headers:**

-   Authorization: Bearer {token}

**Response:**

-   Returns the membership data (organisation or volunteer) for the user with the given ID. For admin, returns an error message since admins have no membership.

**Organisation Example:**

```
{
    "id": 1,
    "user_id": 1,
    "org_name": "Example Org",
    "org_type": "Non-profit",
    "reg_no": "123456",
    "website": "https://example.com",
    "logo": "path/to/logo.jpg",
    "country": "Kenya",
    "city": "Nairobi",
    "focus_area": "Education",
    "is_active": true,
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

**Volunteer Example:**

```
{
    "id": 1,
    "user_id": 1,
    "country": "Kenya",
    "bio": "Passionate volunteer",
    "skills": "Team work, Leadership",
    "location": "Nairobi",
    "profile_image": "path/to/profile.jpg",
    "is_active": true,
    "total_applications": 3,
    "total_hours": 24,
    "total_completed_opportunities": 2,
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---

## Update User

**Endpoint:** `PATCH /update-user/{id}`

**Content-Type:** `application/json` (or `application/x-www-form-urlencoded`)

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The user ID (must be authenticated user's ID unless you're admin)

**Body Parameters (All Optional):**

-   name (string, max 255)
-   email (string, email format, unique)
-   phone (string, max 20)
-   gender (string, enum: `Male`, `Female`, `Other`, `Prefer not to say`)
-   password (string, min 8 characters, requires `password_confirmation` field)
-   password_confirmation (string, required if password is provided)

**Admin-Only Parameters:**

-   role (string, enum: `organisation`, `volunteer`, `admin`)
-   is_verified (boolean)
-   is_active (boolean)

**Response (Success):**

```
{
    "message": "User updated successfully",
    "user": {
        "id": 1,
        "name": "Updated Name",
        "email": "updated@example.com",
        "phone": "1234567890",
        "gender": "Male",
        "role": "volunteer",
        "is_verified": true,
        "is_active": true,
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-11-16T10:00:00.000000Z"
    }
}
```

**Response (Unauthorized - Not your own account):**

```
{
    "message": "Unauthorized - You can only update your own profile"
}
```

**Response (Validation Error):**

```
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email has already been taken"],
        "password": ["The password must be at least 8 characters"]
    }
}
```

---

## Update Membership (Volunteer or Organisation)

**Endpoint:** `PATCH /update/{id}/`

**Content-Type:** `multipart/form-data` (required for file uploads)

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The user ID (must be authenticated user's ID unless you're admin)

**Body Parameters for Volunteer (All Optional):**

-   country (string, max 255)
-   bio (string, max 1000)
-   skills (string, max 255)
-   location (string, max 255)
-   profile_image (file, image format: jpeg/png/jpg/gif, max 2MB)

**Body Parameters for Organisation (All Optional):**

-   org_name (string, max 255)
-   org_type (string, max 255)
-   reg_no (string, max 255, must be unique)
-   website (string, valid URL format)
-   country (string, max 255)
-   city (string, max 255)
-   focus_area (string, max 255)
-   logo (file, image format: jpeg/png/jpg/gif, max 2MB)

**Response for Volunteer (Success):**

```
{
    "message": "Volunteer updated successfully",
    "volunteer": {
        "id": 1,
        "user_id": 1,
        "country": "Kenya",
        "bio": "Passionate about community service",
        "skills": "Team work, Leadership",
        "location": "Nairobi",
        "profile_image": "profile_images/uuid.jpg",
        "profile_image_url": "http://localhost:8000/storage/profile_images/uuid.jpg",
        "is_active": true,
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-11-16T10:00:00.000000Z"
    }
}
```

**Response for Organisation (Success):**

```
{
    "message": "Organisation updated successfully",
    "organisation": {
        "id": 1,
        "user_id": 1,
        "org_name": "Red Cross Kenya",
        "org_type": "NGO",
        "reg_no": "REG001",
        "website": "https://redcross.org.ke",
        "logo": "organisation_logos/uuid.jpg",
        "logo_url": "http://localhost:8000/storage/organisation_logos/uuid.jpg",
        "country": "Kenya",
        "city": "Nairobi",
        "focus_area": "Humanitarian Aid",
        "is_active": true,
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-11-16T10:00:00.000000Z"
    }
}
```

**Response (Unauthorized - Not your own account):**

```
{
    "message": "Unauthorized - You can only update your own profile"
}
```

**Response (Validation Error):**

```
{
    "message": "The given data was invalid.",
    "errors": {
        "website": ["The website must be a valid URL"],
        "profile_image": ["The profile_image must be an image"]
    }
}
```

---

## Delete Membership

**Endpoint:** `DELETE /delete/{id}/`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The membership ID

**Response:**

```
{
    "message": "Membership deleted successfully"
}
```

---

## List All Memberships

**Endpoint:** `GET /all-memberships`
**Headers:**

-   Authorization: Bearer {token}

**Response:**

```
{
	"organisations": [...],
	"volunteers": [...]
}
```

---

## List Active Memberships

**Endpoint:** `GET /active-memberships`
**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
{
	"organisations": [...],
	"volunteers": [...]
}
```

**Note:**

-   Only returns active organisations and volunteers (where `is_active: true`)

---

## Verified Organisations

**Endpoint:** `GET /verified-organisations`
**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "user_id": 1,
        "org_name": "Example Organisation",
        "org_type": "Non-profit",
        "reg_no": "123456",
        "website": "https://example.com",
        "logo": "path/to/logo.jpg",
        "country": "Kenya",
        "city": "Nairobi",
        "focus_area": "Education",
        "is_active": true,
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## Total Volunteers

**Endpoint:** `GET /total-volunteers`
**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Response:**

```
{
	"total_volunteers": 5,
	"volunteers": [
		{
			"id": 1,
			"user_id": 2,
			"country": "Kenya",
			"bio": "Passionate volunteer",
			"skills": "Teaching, Mentoring",
			"location": "Nairobi",
			"profile_image": "profile_images/...",
			"is_active": true,
			"created_at": "2025-11-17T10:30:00.000000Z",
			"updated_at": "2025-11-17T10:30:00.000000Z",
			"total_applications": 3,
			"total_hours": 20,
			"total_completed_opportunities": 1
		},
		...
	]
}
```

**Notes:**

-   For organisations: Returns count and list of unique volunteers who have applied to their opportunities
-   For admins: Returns total count and list of volunteers who have applied to any opportunity
-   Only includes volunteers with active applications
-   The `volunteers` array includes computed fields: `total_applications`, `total_hours`, `total_completed_opportunities`

---

## List All Galleries

**Endpoint:** `GET /all-images`
**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "org_id": 1,
        "image_url": "http://localhost:8000/storage/galleries/image.jpg",
        "caption": "Gallery image",
        "uploaded_at": "2025-10-21T10:00:00.000000Z"
    },
    ...
]
```

---

## My Gallery

**Endpoint:** `GET /my-gallery/{org_id}`
**Headers:**

-   Authorization: Bearer {token} (Admin or Organisation)

**Path Parameters:**

-   org_id (integer, required): The organisation ID

**Response:**

```
[
    {
        "id": 1,
        "org_id": 1,
        "image_url": "http://localhost:8000/storage/galleries/image.jpg",
        "caption": "Gallery image",
        "uploaded_at": "2025-10-21T10:00:00.000000Z"
    },
    ...
]
```

---

## Add Gallery

**Endpoint:** `POST /add-gallery`

**Content-Type:** `multipart/form-data`

**Headers:**

-   Authorization: Bearer {token} (Admin or Organisation)

**Body Parameters:**

-   org_id (integer, required)
-   image (file, required: image file, max 2MB, formats: jpeg,png,jpg,gif)
-   caption (string, optional)

**Response:**

```
{
    "message": "Gallery item added successfully",
    "gallery": {
        "id": 1,
        "org_id": 1,
        "image_url": "http://localhost:8000/storage/galleries/image.jpg",
        "caption": "Gallery image",
        "uploaded_at": "2025-10-21T10:00:00.000000Z"
    }
}
```

---

## Update Gallery

**Endpoint:** `PUT /update-gallery/{id}`

**Content-Type:** `multipart/form-data`

**Headers:**

-   Authorization: Bearer {token} (Admin or Organisation)

**Path Parameters:**

-   id (integer, required): The gallery item ID

**Body Parameters:**

-   image (file, optional: image file, max 2MB, formats: jpeg,png,jpg,gif)
-   caption (string, optional)

**Response:**

```
{
    "message": "Gallery item updated successfully",
    "gallery": {
        "id": 1,
        "org_id": 1,
        "image_url": "http://localhost:8000/storage/galleries/updated_image.jpg",
        "caption": "Updated caption",
        "uploaded_at": "2025-10-21T10:00:00.000000Z"
    }
}
```

---

## Delete Gallery

**Endpoint:** `DELETE /delete-gallery/{id}`
**Headers:**

-   Authorization: Bearer {token} (Admin or Organisation)

**Path Parameters:**

-   id (integer, required): The gallery item ID

**Response:**

```
{
    "message": "Gallery item deleted successfully"
}
```

---

## Send Notification

**Endpoint:** `POST /send-notification`

**Authorization:** Admin or Organisation role only

**Headers:**

-   Authorization: Bearer {token}

**Body Parameters:**

-   message (string, required): Notification message
-   receiver_id (integer, required): ID of the user to receive the notification (must exist)
-   channel (string, required): Notification channel. Must be one of: `email`, `in_app`, `sms`

**Response (Success):**

```
{
    "message": "message sent successfully",
    "notification": {
        "id": 1,
        "message": "Your application has been approved",
        "sent_at": "2025-10-29T10:00:00.000000Z",
        "is_read": false,
        "read_at": null,
        "channel": "in_app",
        "receiver_id": 1,
        "sender_id": 2,
        "created_at": "2025-10-29T10:00:00.000000Z",
        "updated_at": "2025-10-29T10:00:00.000000Z"
    }
}
```

**Response (Unauthorized - Non-admin/org user):**

```
{
    "error": "Only admins and organisations can send notifications"
}
```

**Response (Validation Error):**

```
{
    "message": "The given data was invalid.",
    "errors": {
        "channel": ["The channel must be one of: email, in_app, sms"],
        "receiver_id": ["The selected receiver_id is invalid"]
    }
}
```

---

## My Notifications

**Endpoint:** `GET /my-notifications`

**Headers:**

-   Authorization: Bearer {token}

**Query Parameters:**

-   page (integer, optional): Page number for pagination (default: 1)
-   per_page (integer, optional): Records per page (default: 15)

**Response:**

```
{
    "data": [
        {
            "id": 1,
            "message": "Your application has been approved",
            "sent_at": "2025-10-29T10:00:00.000000Z",
            "is_read": false,
            "read_at": null,
            "channel": "in_app",
            "receiver_id": 1,
            "sender_id": 2,
            "created_at": "2025-10-29T10:00:00.000000Z",
            "updated_at": "2025-10-29T10:00:00.000000Z"
        }
    ],
    "links": {
        "first": "http://api.example.com/my-notifications?page=1",
        "last": "http://api.example.com/my-notifications?page=1",
        "prev": null,
        "next": null
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "per_page": 15,
        "to": 1,
        "total": 1
    }
}
```

---

## Unread Notifications

**Endpoint:** `GET /unread-notifications`

**Headers:**

-   Authorization: Bearer {token}

**Response:**

```
[
    {
        "id": 1,
        "message": "New opportunity available",
        "sent_at": "2025-10-29T10:00:00.000000Z",
        "is_read": false,
        "read_at": null,
        "channel": "in_app",
        "receiver_id": 1,
        "sender_id": 2,
        "created_at": "2025-10-29T10:00:00.000000Z",
        "updated_at": "2025-10-29T10:00:00.000000Z"
    }
]
```

---

## Mark Notification as Read

**Endpoint:** `PUT /mark-as-read/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The notification ID

**Response:**

```
{
    "message": "Notification marked as read"
}
```

**Response (Not Found):**

```
{
    "message": "Notification not found"
}
```

**Response (Unauthorized - Not receiver):**

```
{
    "message": "Unauthorized"
}
```

---

## List All Opportunities

**Endpoint:** `GET /all-opportunities`

**Headers:**

-   Authorization: Bearer {token}

**Response:**

```
[
    {
        "id": 1,
        "organisation_id": 1,
        "title": "Community Clean-up",
        "description": "Help clean up the local park",
        "required_skills": "Physical labor, teamwork",
        "num_volunteers_needed": 10,
        "start_date": "2025-11-01",
        "start_time": "09:00:00",
        "end_date": "2025-11-01",
        "end_time": "17:00:00",
        "schedule": "9 AM - 5 PM",
        "location": "Central Park",
        "benefits": "Free lunch, certificate",
        "application_deadline": "2025-10-25",
        "cv_required": false,
        "attendance_rate": 75.50,
        "total_applicants": 5,
        "organisation_name": "Green Initiative",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## Get Opportunity

**Endpoint:** `GET /get-opportunity/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The opportunity ID

**Response:**

```
{
    "id": 1,
    "organisation_id": 1,
    "title": "Community Clean-up",
    "description": "Help clean up the local park",
    "required_skills": "Physical labor, teamwork",
    "num_volunteers_needed": 10,
    "start_date": "2025-11-01",
    "start_time": "09:00:00",
    "end_date": "2025-11-01",
    "end_time": "17:00:00",
    "schedule": "9 AM - 5 PM",
    "location": "Central Park",
    "benefits": "Free lunch, certificate",
    "application_deadline": "2025-10-25",
    "cv_required": false,
    "attendance_rate": 75.50,
    "total_applicants": 5,
    "organisation_name": "Green Initiative",
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---

## Create Opportunity

**Endpoint:** `POST /create-opportunity`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Body Parameters:**

-   title (string, required): Opportunity title
-   description (string, required): Detailed description
-   required_skills (string, required): Skills needed for the opportunity
-   num_volunteers_needed (integer, required): Number of volunteers required
-   start_date (date, required): Opportunity start date (YYYY-MM-DD)
-   start_time (time, required): Opportunity start time (HH:MM:SS)
-   end_date (date, required): Opportunity end date (must be after or equal to start_date)
-   end_time (time, required): Opportunity end time (HH:MM:SS)
-   schedule (string, required): Schedule/timing information
-   benefits (string, optional): Benefits offered to volunteers
-   application_deadline (date, required): Deadline for applications (must be before or equal to start_date)
-   location (string, required): Location of the opportunity
-   cv_required (boolean, optional): Whether CV is required for applications (default: false)

**Response:**

```
{
    "message": "Opportunity Created Successfuly",
    "opportunity": {
        "id": 1,
        "organisation_id": 1,
        "title": "Community Clean-up",
        "description": "Help clean up the local park",
        "required_skills": "Physical labor, teamwork",
        "num_volunteers_needed": 10,
        "start_date": "2025-11-01",
        "start_time": "09:00:00",
        "end_date": "2025-11-01",
        "end_time": "17:00:00",
        "schedule": "9 AM - 5 PM",
        "location": "Central Park",
        "benefits": "Free lunch, certificate",
        "application_deadline": "2025-10-25",
        "cv_required": false,
        "attendance_rate": 0,
        "total_applicants": 0,
        "organisation_name": "Green Initiative",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
}
```

## Update Opportunity

**Endpoint:** `PATCH /update-opportunity/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The opportunity ID

**Body Parameters:** (all optional)

-   title (string, optional): Opportunity title
-   description (string, optional): Detailed description
-   required_skills (string, optional): Skills needed for the opportunity
-   num_volunteers_needed (integer, optional): Number of volunteers required
-   start_date (date, optional): Opportunity start date
-   start_time (time, optional): Opportunity start time (HH:MM:SS)
-   end_date (date, optional): Opportunity end date
-   end_time (time, optional): Opportunity end time (HH:MM:SS)
-   schedule (string, optional): Schedule/timing information
-   benefits (string, optional): Benefits offered to volunteers
-   application_deadline (date, optional): Deadline for applications
-   location (string, optional): Location of the opportunity
-   cv_required (boolean, optional): Whether CV is required for applications

**Response:**

```
{
    "message": "Opportunity Updated Successfuly",
    "opportunity": {
        "id": 1,
        "organisation_id": 1,
        "title": "Updated Community Clean-up",
        "description": "Help clean up the local park",
        "required_skills": "Physical labor, teamwork",
        "num_volunteers_needed": 10,
        "start_date": "2025-11-01",
        "start_time": "09:00:00",
        "end_date": "2025-11-01",
        "end_time": "17:00:00",
        "schedule": "9 AM - 5 PM",
        "location": "Central Park",
        "benefits": "Free lunch, certificate",
        "application_deadline": "2025-10-25",
        "cv_required": false,
        "attendance_rate": 75.50,
        "total_applicants": 5,
        "organisation_name": "Green Initiative",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
}
```

---

## My Opportunities

**Endpoint:** `GET /my-opportunities`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Response:**

```
[
    {
        "id": 1,
        "organisation_id": 1,
        "title": "Community Clean-up",
        "description": "Help clean up the local park",
        "required_skills": "Physical labor, teamwork",
        "num_volunteers_needed": 10,
        "start_date": "2025-11-01",
        "start_time": "09:00:00",
        "end_date": "2025-11-01",
        "end_time": "17:00:00",
        "schedule": "9 AM - 5 PM",
        "location": "Central Park",
        "benefits": "Free lunch, certificate",
        "application_deadline": "2025-10-25",
        "cv_required": false,
        "attendance_rate": 75.50,
        "total_applicants": 5,
        "organisation_name": "Green Initiative",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

**Notes:**

-   Returns all opportunities created by the authenticated organisation
-   For admin users, returns empty array or undefined opportunities
-   Ordered by creation date

---

## Delete Opportunity

**Endpoint:** `DELETE /delete-opportunity/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The opportunity ID

**Response:**

```
{
    "message": "Opportunity deleted successfully"
}
```

---

## Ongoing Opportunities

**Endpoint:** `GET /ongoing-opportunities`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "organisation_id": 1,
        "title": "Community Clean-up",
        "description": "Help clean up the local park",
        "required_skills": "Physical labor, teamwork",
        "num_volunteers_needed": 10,
        "start_date": "2025-11-01",
        "start_time": "09:00:00",
        "end_date": "2025-11-01",
        "end_time": "17:00:00",
        "schedule": "9 AM - 5 PM",
        "location": "Central Park",
        "benefits": "Free lunch, certificate",
        "application_deadline": "2025-10-25",
        "cv_required": false,
        "attendance_rate": 75.50,
        "total_applicants": 5,
        "organisation_name": "Green Initiative",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

**Notes:**

-   Returns all opportunities where the current date falls between start_date and end_date
-   Only includes ongoing opportunities based on today's date
-   Returns an empty array if no opportunities are currently ongoing

---

---

## List All Applications

**Endpoint:** `GET /all-applications`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
{
    "applications": [
        {
            "id": 1,
            "volunteer_id": 1,
            "opportunity_id": 1,
            "application_date": "2025-10-20",
            "status": "pending",
            "created_at": "2025-10-20T10:00:00.000000Z",
            "updated_at": "2025-10-20T10:00:00.000000Z"
        }
    ],
    "message": "Fetch Successful"
}
```

**Note:**

-   The `list()` method currently does not return `total_applications` count

---

## My Applications

**Endpoint:** `GET /my-applications`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Response:**

```
{
    "applications": [
        {
            "id": 1,
            "volunteer_id": 1,
            "opportunity_id": 1,
            "application_date": "2025-10-20",
            "CV_path": "http://localhost:8000/storage/applications/cvs/cv_filename.pdf",
            "status": "pending",
            "volunteer_name": "John Doe",
            "opportunity_title": "Community Clean-up",
            "created_at": "2025-10-20T10:00:00.000000Z",
            "updated_at": "2025-10-20T10:00:00.000000Z"
        }
    ],
    "total_applications": 1,
    "message": "Fetch Successful"
}
```

---

## My Applicants

**Endpoint:** `GET /my-applicants/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The opportunity ID

**Response:**

```
{
    "applications": [
        {
            "id": 1,
            "volunteer_id": 1,
            "opportunity_id": 1,
            "application_date": "2025-10-20",
            "CV_path": "http://localhost:8000/storage/applications/cvs/cv_12345.pdf",
            "status": "pending",
            "volunteer_name": "John Doe",
            "opportunity_title": "Community Clean-up",
            "created_at": "2025-10-20T10:00:00.000000Z",
            "updated_at": "2025-10-20T10:00:00.000000Z"
        }
    ],
    "total_applications": 1,
    "message": "Fetch Successful"
}
```

---

## Apply for Opportunity

**Endpoint:** `POST /apply`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Content-Type:** `multipart/form-data` (for file uploads)

**Body Parameters:**

-   opportunity_id (integer, required): The opportunity ID to apply for
-   application_date (date, required): Date of application (must be before or on the application deadline)
-   CV (file, optional): PDF/DOC/DOCX file (max 5MB) - Required if the opportunity has `cv_required: true`

**Response (Success):**

```
{
    "application": {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "application_date": "2025-10-20",
        "CV_path": "applications/cvs/uuid.pdf",
        "CV_path_url": "http://localhost:8000/storage/applications/cvs/uuid.pdf",
        "status": "pending",
        "volunteer_name": "John Doe",
        "opportunity_title": "Community Clean-up",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    },
    "message": "Application Created Successfully"
}
```

**Error Cases:**

-   `400`: If a volunteer has already applied for the opportunity
-   `400`: If application date is past the opportunity deadline
-   `400`: If opportunity has already started
-   `400`: If opportunity has reached maximum applications
-   `400`: If CV is required by the opportunity but not provided
-   `400`: If uploaded file is not a valid document (must be pdf, doc, or docx)
-   `400`: If file size exceeds 5MB
-   `403`: If user is not a volunteer
-   `404`: If opportunity not found

**Notes:**

-   Accepted file types: PDF, DOC, DOCX
-   Maximum file size: 5MB
-   If the opportunity requires a CV (`cv_required: true`), the `CV` file is mandatory
-   Each volunteer can only apply once per opportunity
-   CV files are stored securely on the server
-   `CV_path` in database is stored as relative path for portability
-   `CV_path_url` in response is full URL for immediate frontend use

---

## Download CV

**Endpoint:** `GET /download-cv/{applicationId}`

**Headers:**

-   Authorization: Bearer {token} (Volunteer who applied or Organisation who posted opportunity)

**Path Parameters:**

-   applicationId (integer, required): The application ID

**Response (Success):**

-   Returns the CV file for download with appropriate content-type

**Response (Unauthorized):**

```
{
    "message": "Unauthorized"
}
```

**Response (Not Found):**

```
{
    "message": "CV file not found"
}
```

**Notes:**

-   Only the volunteer who applied or the organisation that posted the opportunity can download the CV
-   File is returned with original filename preserved

---

## Update Application Status

**Endpoint:** `PATCH /update-application/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The application ID

**Body Parameters:**

-   status (string, required): New status (pending|accepted|rejected)

**Response (Success):**

```
{
    "application": {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "application_date": "2025-10-20",
        "CV_path": "applications/cvs/uuid.pdf",
        "status": "accepted",
        "volunteer_name": "John Doe",
        "opportunity_title": "Community Clean-up",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    },
    "message": "Application Status Updated Successfully"
}
```

**Response (Unauthorized - Not your opportunity):**

```
{
    "message": "Unauthorized - This is not your opportunity"
}
```

**Response (Unauthorized - Not an organisation):**

```
{
    "message": "Unauthorized"
}
```

**Response (Not Found):**

```
{
    "message": "Application Not Found"
}
```

**Notes:**

-   Only organisations that posted the opportunity can update application status
-   When status is changed to `accepted`, an acceptance email is sent to the volunteer
-   When status is changed to `rejected`, a rejection email is sent to the volunteer
-   The `pending` status does not trigger any email notification
-   Email includes volunteer name, opportunity title, and organisation name

---

## List All Participations

**Endpoint:** `GET /all-participations`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
{
    "participations": [
        {
            "id": 1,
            "volunteer_id": 1,
            "opportunity_id": 1,
            "check_in": "2025-11-01 09:00:00",
            "check_out": "2025-11-01 17:00:00",
            "total_hours": 8,
            "volunteer_name": "John Doe",
            "opportunity_title": "Community Clean-up",
            "created_at": "2025-11-01T09:00:00.000000Z",
            "updated_at": "2025-11-01T17:00:00.000000Z"
        }
    ],
    "total_participations": 1
}
```

---

## My Participations

**Endpoint:** `GET /my-participations`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Response:**

```
{
    "participations": [
        {
            "id": 1,
            "volunteer_id": 1,
            "opportunity_id": 1,
            "check_in": "2025-11-01 09:00:00",
            "check_out": "2025-11-01 17:00:00",
            "total_hours": 8,
            "volunteer_name": "John Doe",
            "opportunity_title": "Community Clean-up",
            "created_at": "2025-11-01T09:00:00.000000Z",
            "updated_at": "2025-11-01T17:00:00.000000Z"
        }
    ],
    "total_participations": 1,
    "total_hours": 8
}
```

---

## Opportunity Participations

**Endpoint:** `GET /opportunity-participations/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The opportunity ID

**Response:**

```
{
    "participations": [
        {
            "id": 1,
            "volunteer_id": 1,
            "opportunity_id": 1,
            "check_in": "2025-11-01 09:00:00",
            "check_out": "2025-11-01 17:00:00",
            "total_hours": 8,
            "volunteer_name": "John Doe",
            "opportunity_title": "Community Clean-up",
            "created_at": "2025-11-01T09:00:00.000000Z",
            "updated_at": "2025-11-01T17:00:00.000000Z"
        }
    ],
    "total_participations": 1
}
```

---

## Add Participation

**Endpoint:** `POST /add-participation`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Body Parameters:**

-   volunteer_id (integer, required): The volunteer ID
-   opportunity_id (integer, required): The opportunity ID
-   check_in (datetime, optional): Check-in time (ISO 8601 format)
-   check_out (datetime, optional): Check-out time (ISO 8601 format, must be after check_in)

**Response:**

```
{
    "message": "Participation created successfully",
    "participation": {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "check_in": "2025-11-01 09:00:00",
        "check_out": "2025-11-01 17:00:00",
        "total_hours": 8,
        "volunteer_name": "John Doe",
        "opportunity_title": "Community Clean-up",
        "created_at": "2025-11-01T09:00:00.000000Z",
        "updated_at": "2025-11-01T09:00:00.000000Z"
    }
}
```

---

## My Trends

**Endpoint:** `GET /my-trends`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Response:**

```
{
    "daily_hour_trends": [
        {
            "date": "2025-11-01",
            "total_hours": 8
        },
        {
            "date": "2025-11-02",
            "total_hours": 6
        },
        {
            "date": "2025-11-03",
            "total_hours": 8
        }
    ]
}
```

**Notes:**

-   Returns daily hour trends for the authenticated volunteer
-   Aggregates total hours participated per day
-   Ordered by date in ascending order
-   Admin users cannot use this endpoint (only volunteers)

---

## List All Users

**Endpoint:** `GET /all-users`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "volunteer",
        "gender": "male",
        "phone": "+1234567890",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## List All Memberships

**Endpoint:** `GET /all-memberships`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "user_id": 1,
        "org_name": "Example Org",
        "org_type": "Non-profit",
        "reg_no": "123456",
        "website": "https://example.com",
        "logo": "path/to/logo.jpg",
        "country": "Kenya",
        "city": "Nairobi",
        "focus_area": "Education",
        "is_active": true,
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## List All Images

**Endpoint:** `GET /all-images`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "org_id": 1,
        "image_url": "path/to/image.jpg",
        "caption": "Gallery image",
        "uploaded_at": "2025-10-20T10:00:00.000000Z",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## List All Applications

**Endpoint:** `GET /all-applications`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "status": "pending",
        "applied_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## List All Participations

**Endpoint:** `GET /all-participations`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "participated_at": "2025-10-20T10:00:00.000000Z",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## List All Notifications

**Endpoint:** `GET /all-notifications`

**Authorization:** Admin only

**Headers:**

-   Authorization: Bearer {token}

**Query Parameters:**

-   page (integer, optional): Page number for pagination (default: 1)
-   per_page (integer, optional): Records per page (default: 15)

**Response:**

```
{
    "data": [
        {
            "id": 1,
            "message": "New opportunity available",
            "sent_at": "2025-10-29T10:00:00.000000Z",
            "is_read": false,
            "read_at": null,
            "channel": "in_app",
            "receiver_id": 1,
            "sender_id": 2,
            "created_at": "2025-10-29T10:00:00.000000Z",
            "updated_at": "2025-10-29T10:00:00.000000Z"
        }
    ],
    "links": {
        "first": "http://api.example.com/all-notifications?page=1",
        "last": "http://api.example.com/all-notifications?page=1",
        "prev": null,
        "next": null
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "per_page": 15,
        "to": 1,
        "total": 1
    }
}
```

**Response (Unauthorized - Non-admin user):**

```
{
    "error": "Only admins can view all notifications"
}
```

---

## My Applicants

**Endpoint:** `GET /my-applicants/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The opportunity ID

**Response:**

```
[
    {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "status": "pending",
        "applied_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z",
        "volunteer": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
]
```

---

## Update Application Status

**Endpoint:** `PATCH /update-application/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The application ID

**Body Parameters:**

-   status (string, required): New status (accepted|rejected)

**Response:**

```
{
    "message": "Application status updated successfully"
}
```

---

## Opportunity Participations

**Endpoint:** `GET /opportunity-participations/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The opportunity ID

**Response:**

```
[
    {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "participated_at": "2025-10-20T10:00:00.000000Z",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z",
        "volunteer": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
]
```

---

## Add Participation

**Endpoint:** `POST /add-participation`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Body Parameters:**

-   volunteer_id (integer, required): The volunteer ID
-   opportunity_id (integer, required): The opportunity ID

**Response:**

```
{
    "message": "Participation added successfully"
}
```

---

## Delete Participation

**Endpoint:** `DELETE /delete-participation/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The participation ID

**Response:**

```
{
    "message": "Participation deleted successfully"
}
```

---

## My Applications

**Endpoint:** `GET /my-applications`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Response:**

```
[
    {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "status": "pending",
        "application_date": "2025-10-20",
        "volunteer_name": "John Doe",
        "opportunity_title": "Community Clean-up",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z",
        "opportunity": {
            "id": 1,
            "title": "Community Clean-up",
            "description": "Help clean up the local park"
        }
    }
]
```

---

## Apply for Opportunity

**Endpoint:** `POST /apply`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Body Parameters:**

-   opportunity_id (integer, required): The opportunity ID

**Response:**

```
{
    "message": "Application submitted successfully"
}
```

---

## Delete Application

**Endpoint:** `DELETE /delete-application/{id}`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Path Parameters:**

-   id (integer, required): The application ID

**Response:**

```
{
    "message": "Application deleted successfully"
}
```

---

## My Participations

**Endpoint:** `GET /my-participations`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Response:**

```
{
    "participations": [
        {
            "id": 1,
            "volunteer_id": 1,
            "opportunity_id": 1,
            "check_in": "2025-10-20 09:00:00",
            "check_out": "2025-10-20 17:00:00",
            "total_hours": 8,
            "volunteer_name": "John Doe",
            "opportunity_title": "Community Clean-up",
            "created_at": "2025-10-20T10:00:00.000000Z",
            "updated_at": "2025-10-20T10:00:00.000000Z"
        }
    ],
    "total_participations": 1,
    "total_hours": 8
}
```

**Notes:**

-   Returns all participation records for the authenticated volunteer
-   total_participations: Count of all participations
-   total_hours: Sum of all hours across all participations
-   Includes appended attributes (volunteer_name, opportunity_title, total_hours)

---

## Get Membership

**Endpoint:** `GET /get/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The user ID

**Response:**

Returns the membership data (organisation or volunteer) for the user with the given ID.

**Organisation Example:**

```
{
    "id": 1,
    "user_id": 1,
    "org_name": "Example Org",
    "org_type": "Non-profit",
    "reg_no": "123456",
    "website": "https://example.com",
    "logo": "path/to/logo.jpg",
    "country": "Kenya",
    "city": "Nairobi",
    "focus_area": "Education",
    "is_active": true,
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

**Volunteer Example:**

```
{
    "id": 1,
    "user_id": 1,
    "country": "Kenya",
    "bio": "Passionate volunteer",
    "skills": "Team work, Leadership",
    "location": "Nairobi",
    "profile_image": "path/to/profile.jpg",
    "is_active": true,
    "total_applications": 3,
    "total_hours": 24,
    "total_completed_opportunities": 2,
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---

## Update Membership

**Endpoint:** `PATCH /update/{id}/`

**Content-Type:** `multipart/form-data` (for file uploads)

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The user ID

**Body Parameters:**

Depends on the membership type (organisation or volunteer):

**For Organisation:**

-   org_name (string, optional)
-   org_type (string, optional)
-   reg_no (string, optional)
-   website (string, optional)
-   logo (file, optional): Organization logo
-   country (string, optional)
-   city (string, optional)
-   focus_area (string, optional)
-   is_active (boolean, optional)

**For Volunteer:**

-   bio (string, optional)
-   skills (string, optional)
-   profile_image (file, optional): Volunteer profile image
-   etc.

**Response:**

```
{
    "id": 1,
    "user_id": 1,
    "org_name": "Example Org",
    "org_type": "Non-profit",
    "reg_no": "123456",
    "website": "https://example.com",
    "logo": "path/to/logo.jpg",
    "country": "Kenya",
    "city": "Nairobi",
    "focus_area": "Education",
    "is_active": true,
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

**Note:**

-   Response object structure varies depending on membership type (Organisation or Volunteer)
-   File uploads (logo/profile_image) are handled automatically

---

## Delete Membership

**Endpoint:** `DELETE /delete/{id}/`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The membership ID

**Response:**

```
{
    "message": "Membership deleted successfully"
}
```

---

## Get Image

**Endpoint:** `GET /get-image/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The image ID

**Response:**

Returns the image data or URL.

```
{
    "id": 1,
    "organisation_id": 1,
    "image_path": "path/to/image.jpg",
    "description": "Gallery image",
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---

## List All Evidences

**Endpoint:** `GET /all-evidences`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "org_id": 1,
        "volunteer_id": 1,
        "rating": 5,
        "comment": "Great evidence!",
        "organisation_name": "Example Org",
        "volunteer_name": "John Doe",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## Organisation Evidences

**Endpoint:** `GET /organisation-evidences/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The organisation ID

**Response:**

```
[
    {
        "id": 1,
        "org_id": 1,
        "volunteer_id": 1,
        "rating": 5,
        "comment": "Great evidence!",
        "organisation_name": "Example Org",
        "volunteer_name": "John Doe",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## My Evidences

**Endpoint:** `POST /my-evidences`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Response:**

```
[
    {
        "id": 1,
        "org_id": 1,
        "volunteer_id": 1,
        "rating": 5,
        "comment": "Great evidence!",
        "organisation_name": "Example Org",
        "volunteer_name": "John Doe",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

**Notes:**

-   Returns evidence records for the authenticated volunteer
-   Only accessible by the volunteer themselves or admin users

---

## Create Evidence

**Endpoint:** `POST /create-evidence`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Body Parameters:**

-   org_id (integer, required): The organisation ID
-   rating (integer, required): Rating value
-   comment (string, optional): Evidence comment

**Response:**

```
{
    "message": "Created Successfully",
    "evidence": {
        "id": 1,
        "org_id": 1,
        "volunteer_id": 1,
        "rating": 5,
        "comment": "Great evidence!",
        "organisation_name": "Example Org",
        "volunteer_name": "John Doe",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
}
```

---

## Update Evidence

**Endpoint:** `PATCH /update-evidence/{id}`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Path Parameters:**

-   id (integer, required): The evidence ID

**Body Parameters:**

-   rating (integer, optional): Updated rating
-   comment (string, optional): Updated comment

**Response:**

```
{
    "message": "Updated Successfully",
    "evidence": {
        "id": 1,
        "org_id": 1,
        "volunteer_id": 1,
        "rating": 4,
        "comment": "Updated evidence!",
        "organisation_name": "Example Org",
        "volunteer_name": "John Doe",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
}
```

---

## Delete Evidence

**Endpoint:** `DELETE /delete-evidence/{id}`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Path Parameters:**

-   id (integer, required): The evidence ID

**Response:**

```
{
    "message": "Deleted Successfully"
}
```

---

## Get Evidence by ID

**Endpoint:** `GET /get-evidence/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The evidence ID

**Response:**

```
{
    "id": 1,
    "org_id": 1,
    "volunteer_id": 1,
    "rating": 5,
    "comment": "Great evidence!",
    "organisation_name": "Example Org",
    "volunteer_name": "John Doe",
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---

## List All Reports

**Endpoint:** `GET /all-reports`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Response:**

```
[
    {
        "id": 1,
        "user_id": 1,
        "title": "Issue Report",
        "description": "Description of the issue",
        "status": "pending",
        "user_name": "John Doe",
        "user_email": "john@example.com",
        "user_role": "volunteer",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## Create Report

**Endpoint:** `POST /create-report`

**Headers:**

-   Authorization: Bearer {token}

**Body Parameters:**

-   title (string, required): Report title
-   description (string, optional): Report description

**Response:**

```
{
    "id": 1,
    "user_id": 1,
    "title": "Issue Report",
    "description": "Description of the issue",
    "status": "pending",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_role": "volunteer",
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---

## Update Report

**Endpoint:** `PATCH /update-report/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The report ID

**Body Parameters:**

-   title (string, optional): Updated title
-   description (string, optional): Updated description

**Response:**

```
{
    "id": 1,
    "user_id": 1,
    "title": "Updated Issue Report",
    "description": "Updated description",
    "status": "pending",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_role": "volunteer",
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---

## Delete Report

**Endpoint:** `DELETE /delete-report/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The report ID

**Response:**

```
{
    "message": "Deleted Successfully"
}
```

---

## Get Report by ID

**Endpoint:** `GET /get-report/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The report ID

**Response:**

```
{
    "id": 1,
    "user_id": 1,
    "title": "Issue Report",
    "description": "Description of the issue",
    "status": "pending",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_role": "volunteer",
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---

## My Reports

**Endpoint:** `GET /my-reports`

**Headers:**

-   Authorization: Bearer {token}

**Response:**

```
[
    {
        "id": 1,
        "user_id": 1,
        "title": "Issue Report",
        "description": "Description of the issue",
        "status": "pending",
        "user_name": "John Doe",
        "user_email": "john@example.com",
        "user_role": "volunteer",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
]
```

---

## Update Report Status

**Endpoint:** `PATCH /update-report-status/{id}`

**Headers:**

-   Authorization: Bearer {token} (Admin only)

**Path Parameters:**

-   id (integer, required): The report ID

**Body Parameters:**

-   status (string, required): New status (pending|resolved|dismissed)

**Response:**

```
{
    "id": 1,
    "user_id": 1,
    "title": "Issue Report",
    "description": "Description of the issue",
    "status": "resolved",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_role": "volunteer",
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
}
```

---
