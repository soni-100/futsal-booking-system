import requests
import json

BASE_URL = "http://localhost:8000/api"

print("=" * 60)
print("FUTSAL BOOKING SYSTEM - TEST SCRIPT")
print("=" * 60)

# Test 1: Register a new user
print("\n1. Testing User Registration...")
register_data = {
    "email": "ninja@gmail.com",
    "password": "TestPassword123",
    "confirm_password": "TestPassword123",
    "first_name": "Ninja",
    "last_name": "User",
    "phone": "9841234567"
}

try:
    response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
    if response.status_code == 201:
        user_data = response.json()
        token = user_data.get('token')
        print(f"✅ Registration successful!")
        print(f"   Token: {token[:20]}...")
        print(f"   User: {user_data['user']['email']}")
    else:
        print(f"❌ Registration failed: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"❌ Registration error: {e}")

# Test 2: Login with registered user
print("\n2. Testing User Login...")
login_data = {
    "email": "ninja@gmail.com",
    "password": "TestPassword123"
}

try:
    response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    if response.status_code == 200:
        user_data = response.json()
        token = user_data.get('token')
        print(f"✅ Login successful!")
        print(f"   Token: {token[:20]}...")
        print(f"   User: {user_data['user']['email']}")
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"❌ Login error: {e}")

# Test 3: Get courts list
print("\n3. Testing Courts Retrieval...")
try:
    response = requests.get(f"{BASE_URL}/courts/")
    if response.status_code == 200:
        courts = response.json()
        print(f"✅ Courts retrieved successfully!")
        print(f"   Total courts: {len(courts)}")
        for court in courts:
            print(f"   - {court['name']} (${court['price_per_hour']}/hour)")
    else:
        print(f"❌ Courts retrieval failed: {response.status_code}")
except Exception as e:
    print(f"❌ Courts error: {e}")

# Test 4: Test payment endpoint (should NOT return 401 anymore)
print("\n4. Testing Payment Endpoint (no auth required)...")
try:
    # Try accessing payment endpoint without token
    response = requests.get(f"{BASE_URL}/bookings/pay/1/")
    if response.status_code == 404:
        print(f"✅ Payment endpoint accessible! (404 because booking doesn't exist yet)")
    elif response.status_code == 401:
        print(f"❌ Payment endpoint still requires authentication!")
    else:
        print(f"✅ Payment endpoint responded with: {response.status_code}")
except Exception as e:
    print(f"❌ Payment endpoint error: {e}")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
