# Finance Tracker API

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## 📊 Income API (`/api/income`)

### POST /add
**Request Body:**
```json
{
  "amount": "Number (required)",
  "type": "String (required, 'Salary' or 'Manual')",
  "date": "String (required, ISO date)"
}
```

**Response:**
```json
{
  "_id": "ObjectId",
  "amount": 50000,
  "type": "Salary",
  "date": "2026-01-01T00:00:00.000Z",
  "createdAt": "2026-01-01T12:00:00.000Z",
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

### GET /history
**Request:** No body required

**Response:**
```json
[
  {
    "_id": "ObjectId",
    "amount": 50000,
    "type": "Salary",
    "date": "2026-01-01T00:00:00.000Z",
    "createdAt": "2026-01-01T12:00:00.000Z",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  }
]
```

---

## 🪣 Bucket API (`/api/bucket`)

### GET /all
**Request:** No body required

**Response:**
```json
[
  {
    "_id": "ObjectId",
    "bucketName": "Emergency Fund",
    "percentage": 20,
    "currentAllocationAmount": 10000,
    "purpose": "Emergency expenses",
    "currentMonthAmount": 5000,
    "bucketFund": 15000,
    "date": "2026-01-01T00:00:00.000Z",
    "createdAt": "2026-01-01T12:00:00.000Z",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  }
]
```

### POST /add
**Request Body:**
```json
{
  "bucketName": "String (required)",
  "percentage": "Number (required, 0-100)",
  "purpose": "String (required)"
}
```

**Response:**
```json
{
  "_id": "ObjectId",
  "bucketName": "Emergency Fund",
  "percentage": 20,
  "currentAllocationAmount": 0,
  "purpose": "Emergency expenses",
  "currentMonthAmount": 0,
  "bucketFund": 0,
  "date": "2026-01-01T00:00:00.000Z",
  "createdAt": "2026-01-01T12:00:00.000Z",
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

### PUT /update/:id
**Request Body:**
```json
{
  "bucketName": "String (optional)",
  "percentage": "Number (optional)",
  "purpose": "String (optional)"
}
```

**Response:**
```json
{
  "_id": "ObjectId",
  "bucketName": "Updated Emergency Fund",
  "percentage": 25,
  "currentAllocationAmount": 10000,
  "purpose": "Updated purpose",
  "currentMonthAmount": 5000,
  "bucketFund": 15000,
  "date": "2026-01-01T00:00:00.000Z",
  "createdAt": "2026-01-01T12:00:00.000Z",
  "updatedAt": "2026-01-01T13:00:00.000Z"
}
```

### DELETE /delete/:id
**Request:** No body required

**Response:**
```json
{
  "message": "Bucket deleted successfully. ₹5000 has been moved to General Savings.",
  "releasedAmount": 5000
}
```

---

## 💸 Expense API (`/api/expense`)

### GET /history
**Request:** No body required

**Response:**
```json
[
  {
    "_id": "ObjectId",
    "amount": 1500,
    "type": "Manual",
    "date": "2026-01-10T00:00:00.000Z",
    "note": "Grocery shopping",
    "createdAt": "2026-01-10T12:00:00.000Z",
    "updatedAt": "2026-01-10T12:00:00.000Z"
  }
]
```

### POST /add
**Request Body:**
```json
{
  "amount": "Number (required)",
  "type": "String (required, 'Manual' or 'Bucket')",
  "date": "String (required, ISO date)",
  "bucketId": "String (required if type='Bucket')",
  "note": "String (optional)"
}
```

**Response (Manual Expense):**
```json
{
  "_id": "ObjectId",
  "amount": 1500,
  "type": "Manual",
  "date": "2026-01-10T00:00:00.000Z",
  "note": "Grocery shopping",
  "createdAt": "2026-01-10T12:00:00.000Z",
  "updatedAt": "2026-01-10T12:00:00.000Z"
}
```

**Response (Bucket Expense):**
```json
{
  "message": "Expense added and bucket updated",
  "expense": {
    "_id": "ObjectId",
    "amount": 2000,
    "type": "Bucket",
    "bucketId": "ObjectId",
    "date": "2026-01-12T00:00:00.000Z",
    "note": "Emergency medical expense"
  },
  "updatedBucketBalance": {
    "currentMonthAmount": 3000,
    "bucketFund": 8000
  }
}
```

### DELETE /delete/:id
**Request:** No body required

**Response:**
```json
{
  "message": "Expense deleted. Money returned to General Savings."
}
```

---

## 📈 Dashboard API (`/api/dashboard`)

### GET /summary
**Request:** No body required

**Response:**
```json
{
  "generalSavings": 15000,
  "netWorth": 85000,
  "lockedFunds": 70000
}
```

---

## 🔧 Error Responses

All endpoints return consistent error format:
```json
{
  "message": "Error description"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
