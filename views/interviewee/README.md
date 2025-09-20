# Interviewee Views

This directory contains all the views and components for the interviewee interface, allowing interviewees to view and access their assigned interviews.

## Structure

```
views/interviewee/
├── home/
│   └── IntervieweeHome.view.tsx     # Main dashboard for interviewees
├── interview-detail/
│   └── InterviewDetail.view.tsx     # Detailed view of a specific interview
├── login/
│   └── IntervieweeLogin.view.tsx    # Login page for interviewees
└── README.md                        # This file
```

## Pages

```
pages/interviewee/
├── index.tsx                        # Home page route (/interviewee) - Protected
├── login.tsx                        # Login page route (/interviewee/login)
└── interview/
    └── [id].tsx                     # Interview detail page route (/interviewee/interview/[id]) - Protected
```

## Authentication System

### Backend Authentication
- **IntervieweeAuthService**: Handles login, password management, and profile operations
- **IntervieweeAuthController**: REST endpoints for interviewee authentication
- **JWT-based authentication**: Separate tokens for interviewees vs regular users
- **Password encryption**: Uses PBKDF2 with salt for secure password storage

### Frontend Authentication
- **IntervieweeAuthContext**: Zustand store for authentication state management
- **IntervieweeAuthGuard**: Component to protect routes requiring authentication
- **Separate token storage**: Uses `intervieweeAccessToken` in localStorage
- **Auto-redirect**: Redirects to login when unauthenticated

## Features

### Home Page (`/interviewee`)
- **Dashboard Overview**: Shows statistics of assigned interviews (Total, Pending, In Progress, Completed)
- **Interview Cards**: Displays all assigned interviews with:
  - Interview title, description, and position
  - Scheduled date and time
  - Current status (Draft, Pending, In Progress, Completed)
  - Survey information
  - Action buttons to start/continue interviews
  - Links to detailed view

### Interview Detail Page (`/interviewee/interview/[id]`)
- **Comprehensive Details**: Shows complete information about a specific interview
- **Schedule Information**: Date, time, start/completion timestamps
- **Survey Details**: Name, description, estimated duration
- **Professional Information**: Assigned professionals
- **Status-specific Actions**: Start, continue, or view completed status
- **Navigation**: Easy navigation back to home

## Components Features

### IntervieweeHome.view.tsx
- **Responsive Design**: Works on desktop and mobile
- **Real-time Status**: Shows current status of each interview
- **Action Buttons**: 
  - "Iniciar Entrevista" (Start Interview) - for NOT_STARTED interviews
  - "Continuar Entrevista" (Continue Interview) - for IN_PROGRESS interviews
  - "Ver Detalles" (View Details) - for all interviews
- **Status Indicators**: Color-coded chips showing interview status
- **Empty State**: Friendly message when no interviews are assigned

### InterviewDetail.view.tsx
- **Complete Information Display**: All relevant interview and survey details
- **Professional Assignment**: Shows assigned professionals with contact info
- **Time Tracking**: Displays creation, update, start, and completion times
- **Status-specific UI**: Different layouts and actions based on interview status
- **Navigation**: Breadcrumb navigation and back button

## API Integration

### Authentication Endpoints
- `POST /interviewee-auth/login` - Login with email and password
- `GET /interviewee-auth/profile` - Get current interviewee profile
- `GET /interviewee-auth/check` - Verify authentication status
- `PATCH /interviewee-auth/change-password` - Change password

### Interview Endpoints
- `GET /interviews/filtered` - Get all interviews (filtered by interviewee on frontend)
- `GET /interviews/{id}` - Get detailed information about a specific interview
- Survey access via `/survey/{surveyId}` route

## Styling

- Uses **HeroUI** components for consistent design
- **Tailwind CSS** for styling
- **Lucide React** icons for visual elements
- Responsive design with mobile-first approach
- Consistent color scheme with the main application

## Usage

### Authentication Flow
1. **Login**: Interviewees access `/interviewee/login` with credentials
2. **Auto-redirect**: Successful login redirects to `/interviewee`
3. **Protected Routes**: All interviewee pages require authentication
4. **Session Management**: Automatic token refresh and logout on expiration

### Interview Management
1. **Dashboard Access**: Authenticated interviewees see their dashboard at `/interviewee`
2. **Starting Interviews**: Click "Iniciar Entrevista" to begin a survey
3. **Continuing**: In-progress interviews show "Continuar Entrevista" 
4. **Details**: Click "Ver Detalles" for comprehensive interview information
5. **Survey Access**: Interview buttons redirect to the survey interface
6. **Profile**: Access profile and logout via navbar dropdown

## Status Flow

1. **DRAFT** → Interview created but not ready
2. **NOT_STARTED** → Ready to begin, shows "Iniciar Entrevista"
3. **IN_PROGRESS** → Partially completed, shows "Continuar Entrevista"  
4. **CLOSED** → Completed, shows completion information

## Future Enhancements

- Authentication for interviewees
- Real-time notifications
- Progress tracking within interviews
- Interview history and results
- Mobile app support
- Offline capability
