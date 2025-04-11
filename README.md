
# O'quv Markazi Tizimi

This is an educational center management system with a React frontend and FastAPI backend.

## Backend Setup (FastAPI with SQLite)

The backend uses FastAPI with SQLite database for data storage.

### Running the Backend

1. Make sure you have Python 3.7+ installed
2. Install the required packages:
   ```
   pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] python-multipart
   ```
3. Run the FastAPI server:
   ```
   uvicorn FastAPI_Backend_Template:app --reload
   ```

This will start the backend server at http://127.0.0.1:8000/

### Default Login

The system comes with default users for testing:
- CEO/Admin: username: `admin`, password: `admin123`
- Mentor: username: `mentor1`, password: `mentor123`

## Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

This will start the frontend at http://localhost:5173/

## Database

The system uses SQLite3 for data storage. The database file is created automatically at `./educational_center.db` when the backend is first run.

### Database Schema:

- **Users**: Authentication and user management
- **Groups**: Classes and course groups
- **Students**: Student information
- **Attendance**: Student attendance records
- **Scores**: Student scoring and achievements

All data is stored in the SQLite database, not in the frontend state.
