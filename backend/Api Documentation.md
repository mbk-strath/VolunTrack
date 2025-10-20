
API Endpoints
Base URL: http://localhost:8000/api/

---

## Register
**Endpoint:** `POST /register`

**Body Parameters:**
- name (string, required)
- email (string, required)
- password (string, required)
- role (string, required: organisation|volunteer|admin)
- phone, gender, and other fields depending on role

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
- email (string, required)
- password (string, required)

**Response:**
- If not verified:
	```
	{
		"message": "Account is not verified. Please check your email for verification instructions."
	}
	```
- If verified:
	```
	{
		"message": "OTP sent to email"
	}
	```

---

## Verify OTP
**Endpoint:** `POST /verify-otp`

**Body Parameters:**
- otp (string, required)

**Response:**
- If wrong/expired OTP:
	```
	{
		"message": "Invalid or expired OTP"
	}
	```
- If correct OTP:
	```
	{
		"user": {
			"id": 1,
			"name": "peter",
			"email": "ramadhan.abdilatif@strathmore.edu",
			...
		},
		"token": "1|JhOoeFmAlQf6rvXbOJYl4IcsqWxfQyO2MhCbUCo9422c6ea7"
	}
	```

---

## Password Reset (Request OTP)
**Endpoint:** `POST /reset-otp`

**Body Parameters:**
- email (string, required)

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
- otp (string, required)
- new_password (string, required)

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
- Authorization: Bearer {token}

**Response:**
```
{
	"message": "Logged out"
}
```

---

## Show User/Organisation/Volunteer
**Endpoint:** `GET /show/{id}`
**Headers:**
- Authorization: Bearer {token}
**Query Parameters:**
- type (admin|organisation|volunteer)

**Response:**
- Returns the user, organisation, or volunteer resource by ID

---

## Update User/Organisation/Volunteer
**Endpoint:** `PUT /update/{id}`
**Headers:**
- Authorization: Bearer {token}
**Query Parameters:**
- type (user|organisation|volunteer)

**Body:**
- Fields to update

**Response:**
- Returns the updated resource

---

## Delete User/Organisation/Volunteer
**Endpoint:** `DELETE /delete/{id}`
**Headers:**
- Authorization: Bearer {token}
**Query Parameters:**
- type (organisation|volunteer)

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
- Authorization: Bearer {token}

**Response:**
```
{
	"organisations": [...],
	"volunteers": [...]
}
```
	
	

