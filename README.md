# DataWave SiLab

A full-stack application with Next.js frontend, FastAPI backend, and MongoDB Atlas database.

## Project Structure

```
silab/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
└── README.md
```

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Backend**: FastAPI with Python
- **Database**: MongoDB Atlas
- **Development**: Hot reload for both frontend and backend

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB Atlas account

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your MongoDB Atlas connection string:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=silab
   ```

6. Start the FastAPI server:
   ```bash
   python main.py
   ```

   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Environment Variables

### Backend (.env)
- `MONGODB_URL` - MongoDB Atlas connection string
- `DB_NAME` - Database name (default: datawave)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Development

Both frontend and backend support hot reload during development. Changes to either codebase will automatically restart the respective server.

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Set up database access (username/password)
4. Configure network access (add your IP)
5. Get the connection string and update your `.env` file
