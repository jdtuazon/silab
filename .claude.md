# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DataWave SiLab is a full-stack application with a Next.js frontend, FastAPI backend, and MongoDB Atlas database. The application features a product management dashboard with search, filtering, and responsive design.

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS 4, React 19, Lucide React icons
- **Backend**: FastAPI with Python, Motor (async MongoDB driver), uvicorn
- **Database**: MongoDB Atlas
- **Development**: Hot reload for both frontend and backend

## Development Commands

### Frontend (from `/frontend` directory)
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (from `/backend` directory)
```bash
# Setup virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
python main.py       # Runs uvicorn on 0.0.0.0:8000
```

## Architecture

### Frontend Structure
- **App Router**: Using Next.js 15 app directory structure with `/products` route
- **Components**: Modular UI components in `src/components/ui/` (Header, Sidebar, ProductCard, TagFilters)
- **Type Definitions**: Product types and interfaces in `src/types/product.ts`
- **API Layer**: Centralized API client in `src/lib/api.ts` with base URL configuration
- **Mock Data**: Development data in `src/lib/mock-data.ts` for UI testing
- **Type Safety**: Full TypeScript support with strict configuration
- **Styling**: Tailwind CSS 4 with orange accent colors and responsive design

### Backend Structure
- **FastAPI Application**: Main app in `main.py` with CORS middleware configured for localhost:3000/3001
- **Database Layer**: Motor async MongoDB client with connection management
- **Event Handlers**: Startup/shutdown events for database connection lifecycle
- **Environment Configuration**: `.env` file with MongoDB URL and database name

### Database Architecture
- **MongoDB Atlas**: Cloud-hosted MongoDB with async Motor driver
- **Connection Pattern**: Single client instance shared across the application
- **Collections**: `test_collection` for sample data operations

## Routes and Endpoints

### Frontend Routes
- `/` - Original home page with health check
- `/products` - Products dashboard with search, filtering, and grid view
- `/products/[id]` - Individual product view (planned)

### Backend API Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /test-data` - Retrieve test data from MongoDB
- `POST /test-data` - Create random test data
- `GET /db-status` - Check MongoDB connection and list collections
- `GET /products` - Retrieve products (planned)
- `GET /products/{id}` - Get individual product (planned)
- `GET /products/{id}/metrics` - Get product metrics (planned)

## Environment Variables

### Backend (`.env`)
- `MONGODB_URL` - MongoDB Atlas connection string
- `DB_NAME` - Database name (defaults to "datawave")

### Frontend (`.env.local`)
- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to http://localhost:8000)

## Development Workflow

1. **Backend First**: Start the FastAPI server to ensure API availability
2. **Frontend Development**: Navigate to `/products` for the main dashboard interface
3. **Mock Data**: UI uses mock data in `src/lib/mock-data.ts` for development
4. **Database Testing**: Use `/db-status` endpoint to verify MongoDB Atlas connection
5. **Hot Reload**: Both servers support automatic reloading during development

## UI Features

### Products Dashboard (`/products`)
- **Search**: Real-time search across product names, categories, and tags
- **Status Filtering**: Filter by development status (in-dev, qa, prod, archived)
- **Tag Filtering**: Click tag pills to filter by multiple tags (AND logic)
- **Responsive Design**: Mobile-friendly with collapsible sidebar
- **Grid Layout**: Product cards with status indicators and hover effects

### Design System
- **Colors**: White background, orange (#F97316) accents for active states
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Reusable Header, Sidebar, ProductCard, and TagFilters components
- **Accessibility**: Proper ARIA labels, semantic HTML, and keyboard navigation

## Database Connection Management

The application uses Motor for async MongoDB operations with proper connection lifecycle:
- Connection established during FastAPI startup event
- Shared client instance across request handlers
- Graceful shutdown during application termination
- Database name configurable via environment variable

## API Client Pattern

Frontend uses a centralized API client (`src/lib/api.ts`) with:
- Configurable base URL via environment variables
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent error handling and JSON parsing
- TypeScript support for request/response types