# FormPilot Authentication System

This document explains the route protection system implemented in FormPilot.

## Overview

The authentication system uses a combination of:
1. **Supabase Auth** for user authentication
2. **React Context** for global auth state management
3. **Route Protection Components** for client-side route guarding

## Components

### 1. AuthContext (`lib/authContext.tsx`)
- Provides global authentication state
- Manages user sessions and auth state changes
- Exposes `user`, `loading`, and `signOut` to child components

### 2. ProtectedRoute (`components/ProtectedRoute.tsx`)
- Wraps pages that require authentication
- Redirects unauthenticated users to login page
- Shows loading spinner while checking auth status

### 3. PublicRoute (`components/PublicRoute.tsx`)
- Wraps pages that should only be accessible to unauthenticated users
- Redirects authenticated users to dashboard
- Used for login and signup pages



## Protected Routes

The following routes require authentication:
- `/dashboard` - User dashboard
- `/form-builder` - Form creation page

## Public Routes (redirect if authenticated)

The following routes redirect authenticated users:
- `/login` - Login page
- `/signup` - Signup page

## Public Routes (always accessible)

The following routes are always accessible:
- `/` - Landing page
- `/demo` - Demo page
- `/api/*` - API endpoints

## Usage

### Protecting a New Route

```tsx
import ProtectedRoute from "../components/ProtectedRoute";

export default function NewProtectedPage() {
  return (
    <ProtectedRoute>
      {/* Your protected content here */}
    </ProtectedRoute>
  );
}
```

### Creating a Public Route

```tsx
import PublicRoute from "../components/PublicRoute";

export default function NewPublicPage() {
  return (
    <PublicRoute>
      {/* Your public content here */}
    </PublicRoute>
  );
}
```

### Using Auth Context

```tsx
import { useAuth } from "../lib/authContext";

export default function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

## Security Features

1. **Client-side Protection**: Immediate redirects based on auth state
2. **Loading States**: Prevents flash of protected content
3. **Global State Management**: Consistent auth state across app
4. **Automatic Redirects**: Seamless user experience
5. **Supabase Integration**: Secure, production-ready authentication

## Testing the System

1. **Unauthenticated User**:
   - Can access `/`, `/demo`, `/login`, `/signup`
   - Gets redirected from `/dashboard`, `/form-builder` to `/login`

2. **Authenticated User**:
   - Can access `/`, `/demo`, `/dashboard`, `/form-builder`
   - Gets redirected from `/login`, `/signup` to `/dashboard`

## Future Enhancements

- Add role-based access control
- Implement email verification flow
- Add password reset functionality
- Enhance middleware with server-side auth checking
- Add session management and refresh tokens
