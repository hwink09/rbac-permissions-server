# RBAC Permissions API

A Role-Based Access Control (RBAC) API built with Express.js that demonstrates different levels of permission management, from basic role checking to advanced hierarchical RBAC with role inheritance.

## Project Description

This is a backend API that implements JWT-based authentication and multiple levels of RBAC authorization. The project showcases three different approaches to implementing RBAC, with the most advanced version (v3) supporting multiple roles per user and hierarchical role inheritance. It uses mock data for demonstration purposes, making it ideal for learning and understanding RBAC concepts.

## Features

### Authentication
- **User Login**: Authenticate users with email and password
- **JWT Token Management**: Generate and verify access tokens and refresh tokens
- **Token Refresh**: Automatically refresh expired access tokens using refresh tokens
- **Secure Logout**: Clear authentication tokens and end user sessions

### Authorization & RBAC
The API implements three levels of RBAC middleware (currently using v3):

**RBAC v1 - Basic Role Checking**
- Simple role-based authorization
- Checks if user's role is in the list of allowed roles
- One role per user

**RBAC v2 - Permission-Based**
- Authorization based on specific permissions rather than roles
- Maps roles to permissions
- Checks if user has required permissions to access resources

**RBAC v3 - Group Roles & Hierarchical (Active)**
- Multiple roles per user
- Hierarchical role inheritance (roles can inherit permissions from other roles)
- Advanced permission aggregation from all assigned roles
- Example hierarchy: `admin` inherits from `moderator`, which inherits from `client`

### Protected Resources
- **Dashboard Access**: Basic authenticated endpoint
- **Messages**: Restricted to users with `read_messages` permission (moderator and admin)
- **Admin Tools**: Restricted to users with `read_admin_tools` permission (admin only)

### Mock Data System
Three mock database implementations corresponding to each RBAC level:
- Pre-configured roles with specific permissions
- Sample user data for testing
- Role inheritance definitions (v3)

## Authentication & Authorization

### JWT Authentication
The API uses **JWT (JSON Web Tokens)** for authentication with **httpOnly cookies** as the token storage mechanism.

**How it works:**
1. User logs in with email and password
2. Server generates `accessToken` and `refreshToken`
3. Tokens are stored in httpOnly cookies (secure, sameSite: none)
4. Client sends cookies automatically with each request
5. Server validates tokens via `authMiddleware.isAuthorized`
6. When access token expires, use refresh token to get a new one

**Security features:**
- httpOnly cookies prevent JavaScript access (XSS protection)
- Separate access token (short-lived) and refresh token (long-lived)
- Secure flag for HTTPS-only transmission
- sameSite: none for cross-origin requests

### Authorization Flow
1. `authMiddleware.isAuthorized` validates JWT token
2. Decoded user info (including roles) is stored in `req.jwtDecoded`
3. `rbacMiddleware` checks if user has required permissions
4. Access granted or denied based on role/permission validation

### Role & Permission Structure (v3)
- **client**: Basic support permissions
- **moderator**: Message management + inherits client permissions
- **admin**: Admin tools + inherits moderator and client permissions

## API Endpoints

### Public Endpoints
- `POST /v1/users/login` - User login
- `DELETE /v1/users/logout` - User logout
- `PUT /v1/users/refresh_token` - Refresh access token

### Protected Endpoints
- `GET /v1/dashboard/access` - Dashboard access (authenticated users)
- `GET /v1/dashboard/messages` - View messages (requires `read_messages` permission)
- `GET /v1/dashboard/admin-tools` - Access admin tools (requires `read_admin_tools` permission)

## Technical Stack

- **Runtime**: Node.js (>= 20.x)
- **Framework**: Express.js 5.x
- **Authentication**: JWT (jsonwebtoken)
- **Security**: CORS, cookie-parser
- **Build**: Babel (ES6+ transpilation)
- **Dev Tools**: ESLint, Nodemon

## Project Structure

```
src/
├── server.js                 # Application entry point
├── config/                   # Configuration files
├── controllers/              # Request handlers
│   ├── userController.js     # Login, logout, refresh token
│   └── dashboardController.js # Protected resources
├── middlewares/              # Middleware functions
│   ├── authMiddleware.js     # JWT authentication
│   ├── rbacMiddlewarev1.js   # Basic role checking
│   ├── rbacMiddlewarev2.js   # Permission-based RBAC
│   └── rbacMiddlewarev3.js   # Hierarchical RBAC (active)
├── models/                   # Mock database
│   ├── mockDBv1.js           # Level 1 data
│   ├── mockDBv2.js           # Level 2 data
│   └── mockDBv3.js           # Level 3 data (active)
├── providers/                # Service providers
│   └── JwtProvider.js        # JWT generation and verification
├── routes/                   # API routes
│   └── v1/
│       ├── index.js          # Route aggregation
│       ├── userRoute.js      # User endpoints
│       └── dashboardRoute.js # Dashboard endpoints
└── utils/                    # Utility functions
    └── rbacUtils.js          # Permission resolution helpers
```

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run production
```

### Linting
```bash
npm run lint
```

## Test Credentials (Mock Data)
- **Email**: `hwink.dev@gmail.com`
- **Password**: `hwinkdev@123`
- **Default Role**: `moderator` (configurable in mockDBv3.js)

---

## Author

**Hwinkdev**  
YouTube: [@hwinkdev.official](https://www.youtube.com/@hwinkdev.official)
