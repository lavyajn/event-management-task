# event-management-task

uncomment the code in App.jsx to run on local machine for the BASE_API_URL

Live Demo:

Live Frontend Portal: https://event-management-task-zeta.vercel.app/

Live Backend API: https://event-management-api-n4ka.onrender.com

Event Management API & Portal

This is a full-stack event management application built with a Node.js/Express backend, a PostgreSQL database, and a React frontend. The REST API provides a complete set of endpoints to manage users, events, and registrations, with robust business logic and error handling. The accompanying React portal provides a user-friendly interface to interact with the API.

System Architecture & User Flow

The application is a classic client-server model:

Backend: A Node.js server using the Express framework handles all business logic, database interactions, and API routing.

Database: A PostgreSQL database stores all data for users, events, and their relationships.

Frontend: A responsive React single-page application (built with Vite) communicates with the backend via REST API calls.

User Interaction Flow

A new user first creates an account. Upon successful creation, their userId is logged to the browser console and saved in localStorage to simulate a "logged-in" session.

The user can view a list of all upcoming events.

The user can create new events through a simple form. The new eventId is also logged to the console for easy testing.

By clicking on an event, the user can view its details, including the list of registered users and capacity statistics.

If a user is "logged in," they can register for an event with a single click from the event details view.

For testing the cancellation endpoint, the user can copy the userId and eventId from the console and use the "Cancel Registration" form. This was implemented as a direct way to test the DELETE endpoint due to time constraints that prevented a more complex UI for this feature.

Setup Instructions

Prerequisites

Node.js (v18 or later)

npm or yarn

A PostgreSQL database (e.g., from Neon)

1. Backend Setup

# 1. Clone the repository
git clone <your-repo-url>
cd <your-repo-folder>

# 2. Navigate to the server directory
cd server

# 3. Install dependencies
npm install

# 4. Create the environment file
# Create a new file named .env in the /server directory and add your database URL:
# DATABASE_URL="postgres://user:password@host:port/dbname?sslmode=require"

# 5. Set up the database tables
# Connect to your PostgreSQL instance and run the SQL commands found in server/init.sql 
# (You would create this file with the CREATE TABLE statements)

# 6. Start the server (runs on http://localhost:2000 by default)
node index.js


2. Frontend Setup

# 1. Open a new terminal and navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Start the React development server (runs on http://localhost:5173 by default)
npm run dev


You can now access the web portal at http://localhost:5173.

API Endpoint Descriptions

The base URL for all API endpoints is http://localhost:2000/api.

User Management

POST /users

Creates a new user.

Request Body:

{
    "name": "Lavya Jain",
    "email": "lavya@example.com"
}


Success Response (201 Created):

{
    "message": "User created successfully!!",
    "UserId": "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d"
}


Error Response (400 Bad Request):

{
    "message": "Please fill the required details."
}


Event Management

POST /events

Creates a new event.

Request Body:

{
    "title": "Annual Tech Summit",
    "date": "2025-11-20T10:00:00Z",
    "location": "Pune",
    "capacity": 500
}


Success Response (201 Created):

{
    "message": "Event created successfully!!",
    "eventId": "f1e2d3c4-b5a6-4987-8e7f-6d5c4b3a2e1f"
}


Error Response (400 Bad Request):

If a field is missing: {"message": "Please fill all the required fields."}

If capacity is invalid: {"message": "Capacity should be a number and between 1 and 1000"}

GET /events

Lists all upcoming events, sorted by a custom comparator.

Sorting Logic: The events are sorted first by date in ascending order (earliest first). If two events share the exact same date and time, they are then sorted alphabetically by location.

Success Response (200 OK):

[
    {
        "id": "f1e2d3c4-...",
        "title": "Annual Tech Summit",
        "date": "2025-11-20T10:00:00.000Z",
        "location": "Pune",
        "capacity": 500
    }
]


No Events Response (200 OK):

{
    "message": "No upcoming events."
}


GET /events/:id

Gets the full details for a single event, including a list of registered users.

Success Response (200 OK):

{
    "id": "f1e2d3c4-...",
    "title": "Annual Tech Summit",
    "date": "2025-11-20T10:00:00.000Z",
    "location": "Pune",
    "capacity": 500,
    "registeredUsers": [
        {
            "id": "a1b2c3d4-...",
            "name": "Lavya Jain",
            "email": "lavya@example.com"
        }
    ]
}


Error Response (404 Not Found): {"message": "Event not found."}

GET /events/:id/stats

Gets registration statistics for a single event.

Success Response (200 OK):

{
    "totalRegistrations": 15,
    "remainingCapacity": 485,
    "percentageOfCapacityUsed": "3.00%"
}


Error Response (404 Not Found): {"message": "Event not found"}

Registration Management

POST /registrations

Registers a user for an event.

Request Body:

{
    "userId": "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d",
    "eventId": "f1e2d3c4-b5a6-4987-8e7f-6d5c4b3a2e1f"
}


Success Response (201 Created): {"message": "Successfully registered for the event."}

Error Responses:

409 Conflict: {"message": "User is already registered for this event."}

400 Bad Request: {"message": "Event is already full."}

400 Bad Request: {"message": "Cannot register for a past event."}

404 Not Found: {"message": "Event not found."}

DELETE /registrations

Cancels a user's registration for an event.

Request Body:

{
    "userId": "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d",
    "eventId": "f1e2d3c4-b5a6-4987-8e7f-6d5c4b3a2e1f"
}


Success Response (200 OK): {"message": "Registration was cancelled successfully."}

Error Response (404 Not Found): {"message": "Registration not found. User was not registered for this event"}

