# SiLab Backend

## Overview
SiLab Backend is a FastAPI-based application that provides compliance analysis and document processing capabilities using RAG (Retrieval-Augmented Generation) technology.

## Features
- 📄 **Document Compliance Analysis** - Line-by-line analysis against Philippine financial regulations
- 🔍 **RAG Integration** - Powered by R2R (RAG to Riches) for intelligent document retrieval
- 📊 **Interactive Analysis** - Real-time violation detection with regulatory citations
- 📁 **File Export** - Generate detailed JSON and text reports
- 🌐 **RESTful API** - Clean, documented API endpoints

## Architecture

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── core/
│   │   ├── config.py          # Application settings
│   │   └── database.py        # MongoDB connection
│   ├── models/
│   │   └── schemas.py         # Pydantic models
│   ├── routers/
│   │   ├── health.py          # Health check endpoints
│   │   ├── test_data.py       # Test data endpoints
│   │   ├── rag.py             # RAG/R2R endpoints
│   │   └── compliance.py      # Compliance analysis
│   └── services/
│       └── r2r_service.py     # R2R integration service
├── main.py                    # Legacy entry point
├── main_new.py               # New entry point
├── requirements.txt          # Python dependencies
├── RAG_setup.md             # RAG pipeline documentation
└── Compliance Documents/    # Regulatory documents (gitignored)
```

### Technology Stack
- **FastAPI** - Modern web framework for APIs
- **MongoDB** - Document database via Motor (async)
- **R2R** - RAG framework for document analysis  
- **Pydantic** - Data validation and serialization
- **HTTPX** - Async HTTP client for R2R communication

## Quick Start

### Prerequisites
- Python 3.9+
- MongoDB instance
- R2R service running on port 7272

### Installation
1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

### Running the Application

#### Option 1: New Structure (Recommended)
```bash
python main_new.py
```

#### Option 2: Legacy Compatibility
```bash
python main.py
```

#### Option 3: Direct Uvicorn
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DB_NAME=silab

# CORS Origins
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001

# R2R Service
R2R_BASE_URL=http://localhost:7272

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

## API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints

#### Health Checks
- `GET /health/` - Basic health check
- `GET /health/database` - Database connectivity check

#### RAG Operations
- `POST /rag/chat` - RAG completion with task prompts
- `POST /rag/search` - Document similarity search
- `POST /rag/ingest` - Upload and ingest documents
- `GET /rag/documents` - List ingested documents

#### Compliance Analysis
- `POST /compliance/analyze` - Analyze text content
- `POST /compliance/upload-analyze` - Upload and analyze file

## RAG Pipeline

### Document Ingestion
The system uses R2R to process compliance documents:

1. **Upload** - PDF documents uploaded to R2R
2. **Chunking** - Documents split into semantic chunks
3. **Embedding** - Each chunk embedded using sentence transformers
4. **Storage** - Vectors stored in R2R's vector database

### Analysis Process
1. **Line Processing** - Document split into individual lines
2. **Retrieval** - For each line, find relevant regulatory chunks
3. **Generation** - LLM analyzes line against retrieved regulations
4. **Violation Detection** - Parse structured violation responses
5. **Report Generation** - Create downloadable JSON/text reports

### Knowledge Base
- **30+ Philippine Regulatory Documents**
  - RA 9160 (Anti-Money Laundering Act)
  - RA 10173 (Data Privacy Act)
  - BSP Banking Circulars
  - SEC Guidelines

## Development

### Running Tests
```bash
# Test RAG pipeline
python test_rag.py

# Test compliance analysis
python test_final_compliance.py

# Test file generation
python test_file_generation.py
```

### Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Code Structure Guidelines
- **Routers** - Group related endpoints
- **Services** - Business logic and external integrations
- **Models** - Pydantic schemas for validation
- **Core** - Configuration and database connections

## Testing Interface

A temporary HTML interface is available for testing:
- **URL**: `http://localhost:3001/temp_chat_ui.html`
- **Features**: Document upload, real-time analysis, file downloads

## Troubleshooting

### Common Issues

1. **R2R Connection Failed**
   ```bash
   # Check R2R service
   curl http://localhost:7272/openapi.json
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Test MongoDB connection
   python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; asyncio.run(AsyncIOMotorClient('mongodb://localhost:27017').admin.command('ping')); print('MongoDB OK')"
   ```

3. **Empty Compliance Analysis**
   - Check R2R model configuration
   - Verify documents are properly ingested
   - Review console logs for API errors

### Debugging
- Enable debug mode: `DEBUG=true` in `.env`
- Check application logs during startup
- Use browser console for frontend debugging
- Review R2R logs for vector search issues

## Contributing

### Code Style
- Follow FastAPI patterns
- Use async/await for I/O operations
- Add type hints to all functions
- Document all endpoints with proper descriptions

### Adding New Features
1. Create router in `app/routers/`
2. Add business logic in `app/services/`
3. Define models in `app/models/schemas.py`
4. Register router in `app/main.py`
5. Update documentation

## Deployment

### Production Setup
1. Set environment variables appropriately
2. Use a production ASGI server (Gunicorn + Uvicorn)
3. Configure reverse proxy (Nginx)
4. Set up monitoring and logging
5. Ensure R2R service is properly configured

### Docker Support (Coming Soon)
```dockerfile
# Planned Docker configuration for containerized deployment
```

## License
This project is part of SiLab's compliance analysis system.

## Support
For issues and questions, please check:
1. This documentation
2. API documentation at `/docs`
3. RAG setup guide in `RAG_setup.md`
4. GitHub issues (if applicable)

---

Last updated: August 2025