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

**Content-Type:** `multipart/form-data` (for file uploads)

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The user ID

**Body Parameters:**

-   name (string, optional)
-   email (string, optional)
-   phone (string, optional)
-   gender (string, optional)
-   password (string, optional)
-   etc. (depending on user role)

**Response:**

```
{
    "id": 1,
    "name": "Updated Name",
    "email": "updated@example.com",
    "phone": "1234567890",
    "gender": "Male",
    "role": "volunteer",
    "is_verified": true,
    "is_active": true,
    "created_at": "2025-10-20T10:00:00.000000Z",
    "updated_at": "2025-10-20T10:00:00.000000Z"
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
	"total_volunteers": 5
}
```

**Notes:**

-   For organisations: Returns count of unique volunteers who have applied to their opportunities
-   For admins: Returns total count of volunteers who have applied to any opportunity
-   Only counts volunteers with active applications

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

**Headers:**

-   Authorization: Bearer {token}

**Body Parameters:**

-   message (string, required): Notification message
-   receiver_id (integer, required): ID of the user to receive the notification
-   channel (string, optional): Notification channel (e.g., email, in_app)
-   sent_at (datetime, optional): When the notification was sent

**Response:**

```
{
    "message": "Notification sent successfully",
    "notification": {
        "id": 1,
        "message": "Your application has been approved",
        "sent_at": "2025-10-29T10:00:00.000000Z",
        "is_read": false,
        "read_at": null,
        "channel": "email",
        "receiver_id": 1,
        "sender_id": 2,
        "created_at": "2025-10-29T10:00:00.000000Z",
        "updated_at": "2025-10-29T10:00:00.000000Z"
    }
}
```

---

## My Notifications

**Endpoint:** `GET /my-notifications`

**Headers:**

-   Authorization: Bearer {token}

**Response:**

```
[
    {
        "id": 1,
        "message": "Your application has been approved",
        "sent_at": "2025-10-29T10:00:00.000000Z",
        "is_read": false,
        "read_at": null,
        "channel": "email",
        "receiver_id": 1,
        "sender_id": 2,
        "created_at": "2025-10-29T10:00:00.000000Z",
        "updated_at": "2025-10-29T10:00:00.000000Z"
    }
]
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
        "sender_id": null,
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

---

## Get Unread Notifications

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
        "sender_id": null,
        "created_at": "2025-10-29T10:00:00.000000Z",
        "updated_at": "2025-10-29T10:00:00.000000Z"
    }
]
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

## Total Attendance Rate

**Endpoint:** `GET /total-volunteers`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Response:**

```
{
    "attendance_rate": 75.50
}
```

**Notes:**

-   Calculates the overall attendance rate across all opportunities for an organisation
-   Formula: `(Total Hours Attended) / (Expected Total Hours) * 100`
-   Expected Total Hours = `num_volunteers_needed * (opportunity duration in hours)`
-   Total Hours Attended = Sum of all participation hours (check_out - check_in)
-   Rounded to 2 decimal places

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
-   application_date (date, required): Date of application
-   CV (file, optional): PDF/DOC/DOCX file (max 5MB) - Required if the opportunity has `cv_required: true`

**Response:**

```
{
    "application": {
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
    },
    "message": "Application Created Successfully"
}
```

**Error Cases:**

-   `400`: If a volunteer has already applied for the opportunity
-   `400`: If CV is required by the opportunity but not provided
-   `400`: If uploaded file is not a valid document (must be pdf, doc, or docx)
-   `400`: If file size exceeds 5MB
-   `404`: If opportunity not found

**Notes:**

-   Accepted file types: PDF, DOC, DOCX
-   Maximum file size: 5MB
-   If the opportunity requires a CV (`cv_required: true`), the `CV` file is mandatory
-   Each volunteer can only apply once per opportunity
-   CV files are stored securely on the server and accessible via the returned URL

---

## Update Application Status

**Endpoint:** `PATCH /update-application/{id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   id (integer, required): The application ID

**Body Parameters:**

-   status (string, required): New status (pending|accepted|rejected)

**Response:**

```
{
    "application": {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "application_date": "2025-10-20",
        "CV_path": null,
        "status": "accepted",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    },
    "message": "Application Status Updated Successfully"
}
```

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

**Headers:**

-   Authorization: Bearer {token} (Admin only)

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
        "sender_id": null,
        "created_at": "2025-10-29T10:00:00.000000Z",
        "updated_at": "2025-10-29T10:00:00.000000Z"
    }
]
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
