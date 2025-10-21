API Endpoints
Base URL: http://localhost:8000/api/

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
-   role (string, required: organisation|volunteer)
-   phone (string, optional)
-   gender (string, optional)

**Additional Parameters based on role:**

_For role: organisation_

-   org_name (string, required)
-   org_type (string, required)
-   registration_number (string, required)
-   website (string, optional)
-   logo (file, optional: image file, max 2MB, formats: jpeg,png,jpg,gif)
-   country (string, required)
-   city (string, required)
-   street_address (string, required)
-   operating_region (string, required)
-   mission_statement (string, optional)
-   focus_area (string, optional)
-   target_beneficiary (string, optional)

_For role: volunteer_

-   country (string, required)
-   bio (string, optional)
-   skills (string, optional)
-   location (string, required)
-   profile_image (file, optional: image file, max 2MB, formats: jpeg,png,jpg,gif)

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

**Endpoint:** `GET /show/{id}`
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

## Update User/Organisation/Volunteer

**Endpoint:** `PUT /update/{id}/{type}`

**Content-Type:** `multipart/form-data` (for file uploads)

**Headers:**

-   Authorization: Bearer {token}

**Path Parameters:**

-   id (integer, required): The ID of the resource
-   type (string, required: user|organisation|volunteer)

**Body Parameters:**

_For type: user_

-   Any user fields to update (e.g., name, email, etc.)

_For type: organisation_

-   Any organisation fields to update
-   logo (file, optional: image file, max 2MB, formats: jpeg,png,jpg,gif)

_For type: volunteer_

-   Any volunteer fields to update
-   profile_image (file, optional: image file, max 2MB, formats: jpeg,png,jpg,gif)

**Response:**

-   Returns the updated resource

```
{
    // Updated resource data
    "id": 1,
    "name": "Updated Name",
    ...
}
```

---

## Delete Organisation/Volunteer

**Endpoint:** `DELETE /delete/{id}/{type}`
**Headers:**

-   Authorization: Bearer {token}
    **Path Parameters:**
-   id (integer, required): The ID of the resource
-   type (string, required: organisation|volunteer)

**Response:**

```
{
	"message": "Organisation deleted"
}
```

or

```
{
	"message": "Volunteer deleted"
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

**Endpoint:** `GET /all-galleries`
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
