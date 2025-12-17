# Parcel Delivery API

A professional, production-ready backend API for a parcel delivery management system built with Express.js, TypeScript, and MongoDB. Features comprehensive authentication, role-based authorization, image uploads, and advanced query capabilities.

## Features

- **JWT Authentication** with access and refresh tokens
- **Role-Based Authorization** (Admin, Sender, Receiver)
- **Image Upload** with Cloudinary integration
- **Advanced Query System** with filtering, sorting, pagination, and search
- **Parcel Management** with embedded status history tracking
- **Unique Tracking ID** generation (format: TRK-YYYYMMDD-XXXXXX)
- **Real-time Status Updates** and delivery tracking
- **Automatic Fee Calculation** based on parcel weight
- **User & Parcel Management** (Admin features)
- **Global Error Handling** with detailed error responses
- **Professional Code Architecture** following best practices

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image storage
- **Multer** for file uploads
- **Zod** for validation
- **Cookie Parser** for cookie management

## Installation

1. Clone the repository

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configurations:
```env
PORT=3000
DB_URL=mongodb://localhost:27017/parcel-delivery
NODE_ENV=development
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES=7d
JWT_REFRESH_EXPIRES=30d
BCRYPT_SALT_ROUND=10
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Start MongoDB (ensure MongoDB is running)

6. Run the development server:
```bash
pnpm dev
```

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/refresh-token` | Get new access token | Public |
| POST | `/logout` | Logout user | Authenticated |
| POST | `/change-password` | Change user password | Authenticated |
| GET | `/profile` | Get current user profile | Authenticated |

### Users (`/api/v1/users`) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all users (with filters, search, pagination) |
| PATCH | `/:userId/toggle-block` | Block/Unblock user |
| DELETE | `/:userId` | Delete user |

### Parcels (`/api/v1/parcels`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/track/:trackingId` | Track parcel (public) | Public |
| POST | `/` | Create new parcel with image | Sender |
| GET | `/my-sent` | Get sender's parcels | Sender |
| PATCH | `/:parcelId/cancel` | Cancel parcel | Sender |
| GET | `/my-received` | Get receiver's parcels | Receiver |
| PATCH | `/:parcelId/confirm-delivery` | Confirm delivery | Receiver |
| GET | `/:parcelId` | Get parcel details | Sender/Receiver/Admin |
| GET | `/` | Get all parcels (with filters) | Admin |
| PATCH | `/:parcelId/status` | Update parcel status | Admin |
| PATCH | `/:parcelId/toggle-block` | Block/Unblock parcel | Admin |

## Advanced Query Features

All list endpoints support advanced query parameters:

### Search
```
GET /api/v1/users?searchTerm=john
GET /api/v1/parcels?searchTerm=TRK-20250109
```

### Filtering
```
GET /api/v1/parcels?role=sender
GET /api/v1/parcels?currentStatus=In Transit
GET /api/v1/parcels?parcelType=Package
```

### Sorting
```
GET /api/v1/parcels?sort=createdAt
GET /api/v1/parcels?sort=-createdAt (descending)
```

### Pagination
```
GET /api/v1/parcels?page=1&limit=10
```

### Field Selection
```
GET /api/v1/parcels?fields=trackingId,currentStatus,fee
```

### Combined Query
```
GET /api/v1/parcels?searchTerm=john&currentStatus=Delivered&sort=-createdAt&page=1&limit=10
```

## User Roles

### Sender
- Register and login
- Create parcel delivery requests with images
- View their sent parcels
- Cancel parcels (before dispatch)
- Track parcel status

### Receiver
- Register and login
- View incoming parcels
- Confirm parcel delivery
- View delivery history
- Track parcel status

### Admin
- View and manage all users and parcels
- Block/Unblock users or parcels
- Update delivery statuses
- Assign parcel statuses manually
- Delete users
- Access to all system features

## Parcel Status Flow

```
Requested → Approved → Dispatched → In Transit → Out for Delivery → Delivered
```

Additional statuses: `Cancelled`, `Returned`

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Alternatively, tokens are stored in HTTP-only cookies for enhanced security.

## Example Usage

### 1. Register a Sender
```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "sender",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

### 2. Register a Receiver
```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "receiver",
  "phone": "0987654321",
  "address": "456 Oak Ave"
}
```

### 3. Login
```json
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sender"
    }
  }
}
```

### 4. Create Parcel with Image (Sender)
```bash
POST /api/v1/parcels
Authorization: Bearer <sender_token>
Content-Type: multipart/form-data

receiverEmail: jane@example.com
receiverName: Jane Smith
receiverPhone: 0987654321
receiverAddress: 456 Oak Ave
parcelType: Package
weight: 2.5
description: Important documents
estimatedDeliveryDate: 2025-01-15
parcelImage: [file upload]
```

### 5. Track Parcel (Public)
```
GET /api/v1/parcels/track/TRK-20250109-ABC123
```

Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Parcel tracking information retrieved successfully",
  "data": {
    "trackingId": "TRK-20250109-ABC123",
    "currentStatus": "In Transit",
    "statusLogs": [
      {
        "status": "Requested",
        "timestamp": "2025-01-09T10:00:00.000Z",
        "updatedBy": {...},
        "note": "Parcel request created"
      },
      {
        "status": "Approved",
        "timestamp": "2025-01-09T11:00:00.000Z",
        "updatedBy": {...},
        "note": "Approved by admin"
      }
    ]
  }
}
```

### 6. Update Parcel Status (Admin)
```json
PATCH /api/v1/parcels/:parcelId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "In Transit",
  "location": "Distribution Center - Downtown",
  "note": "Package sorted and ready for delivery"
}
```

### 7. Get All Parcels with Filters (Admin)
```
GET /api/v1/parcels?currentStatus=Delivered&sort=-createdAt&page=1&limit=10
Authorization: Bearer <admin_token>
```

## Project Structure

```
src/
├── config/
│   ├── database.ts              # MongoDB connection
│   ├── env.ts                   # Environment configuration
│   ├── cloudinary.config.ts     # Cloudinary setup
│   └── multer.config.ts         # Multer file upload config
├── errorHelpers/
│   ├── AppError.ts              # Custom error class
│   ├── handleCastError.ts       # MongoDB cast error handler
│   ├── handleDuplicateError.ts  # Duplicate key error handler
│   └── handleValidationError.ts # Validation error handler
├── interfaces/
│   └── error.interface.ts       # Error type definitions
├── middlewares/
│   ├── checkAuth.ts             # Authentication middleware
│   ├── globalErrorHandler.ts   # Global error handler
│   └── notFound.ts              # 404 handler
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   ├── user/
│   │   ├── user.interface.ts
│   │   ├── user.model.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.routes.ts
│   └── parcel/
│       ├── parcel.interface.ts
│       ├── parcel.model.ts
│       ├── parcel.controller.ts
│       ├── parcel.service.ts
│       └── parcel.routes.ts
├── utils/
│   ├── catchAsync.ts            # Async error wrapper
│   ├── generateTrackingId.ts    # Tracking ID generator
│   ├── jwt.ts                   # JWT utilities
│   ├── QueryBuilder.ts          # Advanced query builder
│   ├── sendResponse.ts          # Response formatter
│   ├── setCookie.ts             # Cookie utilities
│   └── userTokens.ts            # Token generation
├── app.ts                       # Express app setup
└── server.ts                    # Server entry point
```

## Response Format

All responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {...},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errorSources": [
    {
      "path": "email",
      "message": "Email already exists"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

## Business Rules

- Senders can only cancel parcels before they are dispatched
- Receivers can only confirm delivery when parcel status is "Out for Delivery"
- Blocked users cannot access the system
- Each parcel has a unique tracking ID
- Fee is automatically calculated: Base Fee (50) + Weight × Rate (20 per kg)
- Status history is embedded within parcel documents
- Parcel images are stored in Cloudinary
- All passwords are hashed with bcrypt
- JWT tokens are stored in HTTP-only cookies for security

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors** - Mongoose validation errors with field-specific messages
- **Cast Errors** - Invalid MongoDB ObjectId handling
- **Duplicate Errors** - Unique constraint violations
- **JWT Errors** - Token expiration and invalid token handling
- **Custom Errors** - Business logic errors with appropriate status codes
- **Global Error Handler** - Centralized error processing

## Security Features

- Passwords hashed with bcrypt (configurable salt rounds)
- JWT tokens for stateless authentication
- Refresh token support for extended sessions
- HTTP-only cookies for token storage
- Role-based access control (RBAC)
- Protected routes with middleware
- User blocking functionality
- Input validation and sanitization
- CORS enabled with credential support
- Trust proxy for secure cookie handling

## Development

```bash
# Development mode with auto-reload
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DB_URL | MongoDB connection string | mongodb://localhost:27017/parcel-delivery |
| NODE_ENV | Environment mode | development |
| JWT_ACCESS_SECRET | JWT access token secret | - |
| JWT_REFRESH_SECRET | JWT refresh token secret | - |
| JWT_ACCESS_EXPIRES | Access token expiration | 7d |
| JWT_REFRESH_EXPIRES | Refresh token expiration | 30d |
| BCRYPT_SALT_ROUND | Bcrypt salt rounds | 10 |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | - |
| CLOUDINARY_API_KEY | Cloudinary API key | - |
| CLOUDINARY_API_SECRET | Cloudinary API secret | - |

## Testing

Use Postman, Thunder Client, or any API client to test the endpoints:

1. Import the API collection
2. Set up environment variables
3. Test authentication flow
4. Test with different user roles
5. Test advanced query features
6. Test file uploads
7. Test error scenarios

## Deployment

1. Set all environment variables on your hosting platform
2. Ensure MongoDB is accessible from your server
3. Configure Cloudinary for production
4. Build the project: `pnpm build`
5. Start the server: `pnpm dev`


## Future Enhancements

- Delivery agent assignment
- Real-time notifications with WebSockets
- Payment integration (Stripe/PayPal)
- Discount coupons and promotions
- Advanced analytics dashboard
- Geolocation tracking with Google Maps
- Email notifications with templates
- SMS alerts for status updates
- Rate limiting for API security
- API documentation with Swagger
- Unit and integration tests
- CI/CD pipeline

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

ISC

## Support

For issues, questions, or contributions, please open an issue on GitHub or contact the maintainers.

---

Built with using Express.js, TypeScript, and MongoDB
