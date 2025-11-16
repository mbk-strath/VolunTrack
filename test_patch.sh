#!/bin/bash

BASE_URL="http://localhost:8000/api"

# First, let's create a test user
echo "=== Creating test user ==="
REGISTER=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser'$(date +%s)'@example.com",
    "password": "password123",
    "gender": "Male",
    "role": "volunteer"
  }')

echo "$REGISTER"
USER_ID=$(echo "$REGISTER" | jq -r '.user.id // empty')

if [ -z "$USER_ID" ]; then
  echo "Failed to create user, checking if admin exists..."
  # Use existing admin user for testing
  USER_ID=1
  echo "Using existing admin user: $USER_ID"
fi

# Get admin token
echo -e "\n=== Getting admin token ==="
LOGIN=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Nat.abdilatif@strathmore.edu",
    "password": "password"
  }')

echo "$LOGIN"

# Extract OTP and verify
OTP=$(curl -s -X GET "http://localhost:8000/api/verify/1" \
  -H "Content-Type: application/json")

# Try verifying OTP
OTP_CODE=$(echo "123456")

VERIFY_OTP=$(curl -s -X POST "$BASE_URL/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"otp\": \"$OTP_CODE\"}")

echo -e "\n=== OTP Verification ==="
echo "$VERIFY_OTP"

TOKEN=$(echo "$VERIFY_OTP" | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo "Could not get token, trying manual approach..."
  TOKEN=$(curl -s -X GET "http://localhost:8000/api/user" \
    -H "Authorization: Bearer $(php artisan tinker --execute='echo \App\Models\User::find(1)->createToken(\"test\")->plainTextToken;')" | jq -r '.token // empty')
fi

echo -e "\n=== Testing PATCH /update-user/{id} ==="
echo "User ID: $USER_ID"
echo "Token: ${TOKEN:0:20}..."

# Get the token directly from database
TOKEN=$(cd /home/school/Desktop/software_project/backend && php artisan tinker --execute="
\$user = \App\Models\User::find(1);
echo \$user->createToken('test')->plainTextToken;
" 2>/dev/null | tail -1)

echo "Using token: ${TOKEN:0:20}..."

# Test PATCH request
echo -e "\n=== Making PATCH request ==="
PATCH_RESPONSE=$(curl -s -X PATCH "http://localhost:8000/api/update-user/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated User",
    "phone": "1234567890"
  }')

echo "$PATCH_RESPONSE"

echo -e "\n=== Done ==="
