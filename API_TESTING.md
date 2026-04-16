# Tap-Track - API Testing Guide

## Using Postman or cURL

### Authentication

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tap-track.local",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@tap-track.local",
    "name": "Admin User",
    "role": "admin"
  }
}
```

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword",
    "name": "New User"
  }'
```

### Attendance Endpoints

#### Get Statistics
```bash
curl -X GET http://localhost:5000/api/attendance/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Record Check-In
```bash
curl -X POST http://localhost:5000/api/attendance/checkin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Record Check-Out
```bash
curl -X POST http://localhost:5000/api/attendance/checkout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get User Attendance
```bash
curl -X GET http://localhost:5000/api/attendance/user/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### User Management (Admin Only)

#### Get All Users
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Specific User
```bash
curl -X GET http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Update User
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "role": "manager"
  }'
```

#### Delete User
```bash
curl -X DELETE http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Reports

#### Get Attendance Report
```bash
curl -X GET "http://localhost:5000/api/reports/attendance?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Summary Report
```bash
curl -X GET http://localhost:5000/api/reports/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Export Data
```bash
curl -X POST http://localhost:5000/api/reports/export \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }'
```

## Postman Collection

### Setup Steps

1. Create new Collection: "Tap-Track API"
2. Add Environment Variable: `base_url` = `http://localhost:5000/api`
3. Add Environment Variable: `token` = (leave empty, will be set after login)

### Create Requests

#### Login (Sets token for other requests)
- **Method**: POST
- **URL**: `{{base_url}}/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "admin@tap-track.local",
  "password": "password123"
}
```
- **Tests** (Script):
```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
}
```

#### Get Stats
- **Method**: GET
- **URL**: `{{base_url}}/attendance/stats`
- **Headers**: `Authorization: Bearer {{token}}`

#### Check In
- **Method**: POST
- **URL**: `{{base_url}}/attendance/checkin`
- **Headers**: `Authorization: Bearer {{token}}`

#### Check Out
- **Method**: POST
- **URL**: `{{base_url}}/attendance/checkout`
- **Headers**: `Authorization: Bearer {{token}}`

## Testing Workflow

1. **Login** to get authentication token
2. **Check In** to record attendance
3. **Get Stats** to verify check-in
4. **Check Out** to end shift
5. **Get Reports** to view attendance data

## Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

## Tips

- Always include Authorization header once authenticated
- Use environment variables for base URL and token
- Test endpoints in order: Auth → Attendance → Reports
- Check response codes and messages for debugging
