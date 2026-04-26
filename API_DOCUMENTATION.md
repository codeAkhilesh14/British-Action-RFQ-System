# API Documentation & Examples

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

### Signup
**Endpoint**: `POST /auth/signup`

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+44 1234 567890",
  "company": "Acme Corp",
  "role": "buyer"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "63f7d4b8c1234567890abcd1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

### Login
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "63f7d4b8c1234567890abcd1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

### Get Current User
**Endpoint**: `GET /auth/me`
**Authentication**: Required (JWT Cookie)

**Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "63f7d4b8c1234567890abcd1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+44 1234 567890",
    "company": "Acme Corp",
    "role": "buyer",
    "isActive": true,
    "profileImage": null
  }
}
```

### Logout
**Endpoint**: `POST /auth/logout`
**Authentication**: Required

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## RFQ Management

### Create RFQ
**Endpoint**: `POST /rfq/create`
**Authentication**: Required (Buyer only)

**Request**:
```json
{
  "title": "Office Furniture Supply",
  "description": "Looking for office furniture and fixtures for 50 workstations",
  "startTime": "2024-05-01T10:00:00",
  "endTime": "2024-05-01T14:00:00",
  "forcedEndTime": "2024-05-01T16:00:00",
  "notes": "Please provide warranty information"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "RFQ created successfully",
  "rfq": {
    "id": "63f7d4b8c1234567890abcd2",
    "title": "Office Furniture Supply",
    "description": "Looking for office furniture...",
    "startTime": "2024-05-01T10:00:00Z",
    "endTime": "2024-05-01T14:00:00Z",
    "forcedEndTime": "2024-05-01T16:00:00Z",
    "status": "pending"
  }
}
```

### Get All RFQs
**Endpoint**: `GET /rfq/all`
**Query Parameters**: `?status=active` (optional)

**Response** (200):
```json
{
  "success": true,
  "count": 5,
  "rfqs": [
    {
      "_id": "63f7d4b8c1234567890abcd2",
      "title": "Office Furniture Supply",
      "description": "...",
      "buyerId": {
        "_id": "63f7d4b8c1234567890abcd1",
        "name": "John Buyer",
        "email": "buyer@example.com",
        "company": "Acme Corp"
      },
      "currentLowestBid": 5000,
      "currentLowestBidderId": {
        "_id": "63f7d4b8c1234567890abcd3",
        "name": "Jane Supplier",
        "email": "supplier@example.com"
      },
      "status": "active",
      "bidsCount": 3,
      "startTime": "2024-05-01T10:00:00Z",
      "endTime": "2024-05-01T14:00:00Z",
      "forcedEndTime": "2024-05-01T16:00:00Z"
    }
  ]
}
```

### Get RFQ Details
**Endpoint**: `GET /rfq/:id`

**Response** (200):
```json
{
  "success": true,
  "rfq": {
    "_id": "63f7d4b8c1234567890abcd2",
    "title": "Office Furniture Supply",
    "description": "...",
    "buyerId": {...},
    "currentLowestBid": 5000,
    "bidsCount": 3,
    "status": "active"
  },
  "bids": [
    {
      "_id": "63f7d4b8c1234567890abcd4",
      "rfqId": "63f7d4b8c1234567890abcd2",
      "bidderId": {
        "_id": "63f7d4b8c1234567890abcd3",
        "name": "Jane Supplier",
        "email": "supplier@example.com"
      },
      "bidAmount": 5000,
      "bidTime": "2024-05-01T11:30:00Z",
      "message": "Can deliver in 2 weeks",
      "status": "active"
    }
  ]
}
```

---

## Bidding

### Place Bid
**Endpoint**: `POST /bid/place`
**Authentication**: Required (Supplier only)

**Request**:
```json
{
  "rfqId": "63f7d4b8c1234567890abcd2",
  "bidAmount": 4800,
  "message": "Fast delivery available"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Bid placed successfully",
  "bid": {
    "_id": "63f7d4b8c1234567890abcd5",
    "rfqId": "63f7d4b8c1234567890abcd2",
    "bidderId": {
      "_id": "63f7d4b8c1234567890abcd3",
      "name": "Jane Supplier",
      "email": "supplier@example.com"
    },
    "bidAmount": 4800,
    "bidTime": "2024-05-01T12:15:00Z",
    "status": "active"
  },
  "rfq": {
    "id": "63f7d4b8c1234567890abcd2",
    "currentLowestBid": 4800,
    "endTime": "2024-05-01T14:00:00Z"
  }
}
```

### Error: Bid Too High
**Response** (400):
```json
{
  "success": false,
  "message": "Bid amount must be lower than current lowest bid of 5000"
}
```

### Get Bids for RFQ
**Endpoint**: `GET /bid/:rfqId`

**Response** (200):
```json
{
  "success": true,
  "count": 3,
  "bids": [
    {
      "_id": "63f7d4b8c1234567890abcd4",
      "rfqId": "63f7d4b8c1234567890abcd2",
      "bidderId": {...},
      "bidAmount": 5000,
      "bidTime": "2024-05-01T11:30:00Z",
      "status": "outbid"
    }
  ]
}
```

### Get My Bids
**Endpoint**: `GET /bid/my-bids/all`
**Authentication**: Required (Supplier)

**Response** (200):
```json
{
  "success": true,
  "count": 2,
  "bids": [
    {
      "_id": "63f7d4b8c1234567890abcd5",
      "rfqId": {
        "_id": "63f7d4b8c1234567890abcd2",
        "title": "Office Furniture Supply",
        "currentLowestBid": 4800,
        "status": "active"
      },
      "bidAmount": 4800,
      "bidTime": "2024-05-01T12:15:00Z",
      "status": "active"
    }
  ]
}
```

---

## User Profile

### Get Profile
**Endpoint**: `GET /user/profile`
**Authentication**: Required

**Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "63f7d4b8c1234567890abcd1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+44 1234 567890",
    "company": "Acme Corp",
    "role": "buyer",
    "isActive": true,
    "profileImage": null,
    "createdAt": "2024-04-28T10:00:00Z"
  }
}
```

### Update Profile
**Endpoint**: `PUT /user/profile`
**Authentication**: Required

**Request**:
```json
{
  "name": "John Doe",
  "phone": "+44 1234 567891",
  "company": "Acme Corp Updated"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "63f7d4b8c1234567890abcd1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+44 1234 567891",
    "company": "Acme Corp Updated",
    "role": "buyer"
  }
}
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Please login first"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "RFQ not found"
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+44 1234 567890",
    "role": "supplier"
  }' \
  -c cookies.txt
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Get All RFQs
```bash
curl -X GET http://localhost:5000/api/rfq/all
```

---

## Testing with Axios (Frontend)

```javascript
import axiosInstance from './api/axiosInstance';

// Signup
axiosInstance.post('/auth/signup', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  phone: '+44 1234 567890',
  role: 'buyer'
});

// Login
axiosInstance.post('/auth/login', {
  email: 'john@example.com',
  password: 'password123'
});

// Get Current User
axiosInstance.get('/auth/me');

// Create RFQ
axiosInstance.post('/rfq/create', {
  title: 'Office Furniture',
  description: 'Looking for furniture...',
  startTime: '2024-05-01T10:00:00',
  endTime: '2024-05-01T14:00:00',
  forcedEndTime: '2024-05-01T16:00:00'
});

// Place Bid
axiosInstance.post('/bid/place', {
  rfqId: '63f7d4b8c1234567890abcd2',
  bidAmount: 4800,
  message: 'Fast delivery'
});
```

---

## Status Codes

- `200`: OK - Request successful
- `201`: Created - Resource created successfully
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Authorization failed
- `404`: Not Found - Resource not found
- `500`: Server Error - Internal error

---

**For more help, check the README.md or QUICK_START.md files**
