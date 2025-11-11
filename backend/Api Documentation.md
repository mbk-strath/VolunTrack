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
**Headers:**

-   Authorization: Bearer {token}

**Response:**

-   Returns the membership data (organisation or volunteer) for the user with the given ID. For admin, returns an error message since admins have no membership.

```
{
    // Organisation or Volunteer data
    "id": 1,
    "user_id": 1,
    "org_name": "Example Org",
    ...
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
-   profile_image (file, optional: for volunteers)
-   org_name (string, optional: for organisations)
-   etc. (depending on user role)

**Response:**

```
{
    "message": "User updated successfully",
    "user": {
        "id": 1,
        "name": "Updated Name",
        ...
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
        "end_date": "2025-11-01",
        "schedule": "9 AM - 5 PM",
        "location": "Central Park",
        "benefits": "Free lunch, certificate",
        "application_deadline": "2025-10-25",
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
    "end_date": "2025-11-01",
    "schedule": "9 AM - 5 PM",
    "location": "Central Park",
    "benefits": "Free lunch, certificate",
    "application_deadline": "2025-10-25",
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
-   start_date (date, required): Opportunity start date
-   end_date (date, required): Opportunity end date (must be after or equal to start_date)
-   schedule (string, required): Schedule/timing information
-   benefits (string, optional): Benefits offered to volunteers
-   application_deadline (date, required): Deadline for applications (must be before or equal to start_date)
-   location (string, required): Location of the opportunity

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
        "end_date": "2025-11-01",
        "schedule": "9 AM - 5 PM",
        "location": "Central Park",
        "benefits": "Free lunch, certificate",
        "application_deadline": "2025-10-25",
        "attendance_rate": 0,
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
}
```

---

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
-   end_date (date, optional): Opportunity end date
-   schedule (string, optional): Schedule/timing information
-   benefits (string, optional): Benefits offered to volunteers
-   application_deadline (date, optional): Deadline for applications
-   location (string, optional): Location of the opportunity

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
        "end_date": "2025-11-01",
        "schedule": "9 AM - 5 PM",
        "location": "Central Park",
        "benefits": "Free lunch, certificate",
        "application_deadline": "2025-10-25",
        "attendance_rate": 0,
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    }
}
```

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
    "message": "Fetch Successlful"
}
```

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
            "status": "pending",
            "volunteer_name": "John Doe",
            "opportunity_title": "Community Clean-up",
            "created_at": "2025-10-20T10:00:00.000000Z",
            "updated_at": "2025-10-20T10:00:00.000000Z"
        }
    ],
    "message": "Fetch Successlful"
}
```

---

## My Applicants

**Endpoint:** `GET /my-applicants/{opportunity_id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   opportunity_id (integer, required): The opportunity ID

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
    "message": "Fetch Successlful"
}
```

---

## Apply for Opportunity

**Endpoint:** `POST /apply`

**Headers:**

-   Authorization: Bearer {token} (Volunteer or Admin only)

**Body Parameters:**

-   opportunity_id (integer, required): The opportunity ID to apply for
-   application_date (date, required): Date of application

**Response:**

```
{
    "application": {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "application_date": "2025-10-20",
        "status": "pending",
        "created_at": "2025-10-20T10:00:00.000000Z",
        "updated_at": "2025-10-20T10:00:00.000000Z"
    },
    "message": "Application Created Successfully"
}
```

---

## Update Application Status

**Endpoint:** `PUT /update-application/{application_id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   application_id (integer, required): The application ID

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
[
    {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "check_in": "2025-11-01 09:00:00",
        "check_out": "2025-11-01 17:00:00",
        "total_hours": 8,
        "created_at": "2025-11-01T09:00:00.000000Z",
        "updated_at": "2025-11-01T17:00:00.000000Z"
    }
]
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
            "created_at": "2025-11-01T09:00:00.000000Z",
            "updated_at": "2025-11-01T17:00:00.000000Z"
        }
    ],
    "total_hours": 8
}
```

---

## Opportunity Participations

**Endpoint:** `GET /opportunity-participations/{opportunity_id}`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Path Parameters:**

-   opportunity_id (integer, required): The opportunity ID

**Response:**

```
[
    {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "check_in": "2025-11-01 09:00:00",
        "check_out": "2025-11-01 17:00:00",
        "total_hours": 8,
        "created_at": "2025-11-01T09:00:00.000000Z",
        "updated_at": "2025-11-01T17:00:00.000000Z"
    }
]
```

---

## Add Participation

**Endpoint:** `POST /add-participation`

**Headers:**

-   Authorization: Bearer {token} (Organisation or Admin only)

**Body Parameters:**

-   volunteer_id (string, required): The volunteer ID
-   opportunity_id (integer, required): The opportunity ID
-   check_in (datetime, optional): Check-in time
-   check_out (datetime, optional): Check-out time (must be after check_in)

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
        "created_at": "2025-11-01T09:00:00.000000Z",
        "updated_at": "2025-11-01T17:00:00.000000Z"
    }
}
```

---

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
        "registration_number": "123456",
        "website": "https://example.com",
        "country": "Kenya",
        "city": "Nairobi",
        "street_address": "123 Main St",
        "operating_region": "Nairobi",
        "mission_statement": "To help the community",
        "focus_area": "Education",
        "target_beneficiary": "Children",
        "logo": "path/to/logo.jpg",
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
[
    {
        "id": 1,
        "volunteer_id": 1,
        "opportunity_id": 1,
        "participated_at": "2025-10-20T10:00:00.000000Z",
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

## Get Membership

**Endpoint:** `GET /get/{id}`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The user ID

**Response:**

Returns the membership data (organisation or volunteer) for the user with the given ID.

```
{
    "id": 1,
    "user_id": 1,
    "org_name": "Example Org",
    ...
}
```

---

## Update Membership

**Endpoint:** `PATCH /update/{id}/`

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The membership ID

**Body Parameters:**

Depends on the membership type (organisation or volunteer). Similar to registration parameters.

**Response:**

```
{
    "message": "Membership updated successfully"
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

**Body Parameters:**

-   volunteer_id (integer, required): The volunteer ID

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
