# Futsal Booking Frontend

A modern React application for booking futsal courts.

## Features

- User authentication (Login/Register)
- Browse available futsal courts
- Book courts with date and time selection
- User dashboard with booking history
- Dynamic navbar based on authentication state
- Responsive design with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/       # Reusable components (Navbar, ProtectedRoute)
├── context/         # React Context (AuthContext)
├── pages/          # Page components (Home, Login, Register, etc.)
├── services/       # API service configuration
├── App.jsx         # Main app component with routing
└── main.jsx        # Entry point
```

## API Integration

The app is configured to connect to a Django backend running on `http://localhost:8000`. Update the API endpoints in `src/services/api.js` to match your backend configuration.

## Environment Variables

Create a `.env` file if needed:
```
VITE_API_URL=http://localhost:8000/api
```
