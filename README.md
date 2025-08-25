# SiLab - Philippine Financial Compliance Analysis Platform

A comprehensive platform that combines a modern Next.js frontend with a Python FastAPI backend and R2R RAG pipeline for intelligent compliance analysis of financial documents against Philippine regulations.

## 🏗️ Architecture Overview

```
Frontend (Next.js)     Backend (FastAPI)     RAG Pipeline (R2R)
     │                        │                      │
┌────▼────┐              ┌────▼────┐           ┌─────▼─────┐
│ React   │◄─────────────┤ FastAPI │◄──────────┤ R2R v3    │
│ TypeScript│             │ Python  │           │ Knowledge │
│ Tailwind│              │ MongoDB │           │ Base      │
└─────────┘              └─────────┘           └───────────┘
     │                        │                      │
┌────▼────┐              ┌────▼────┐           ┌─────▼─────┐
│ Product │              │Compliance│          │Philippine │
│Dashboard│              │Analysis │          │Regulatory │
│         │              │Endpoints│          │Documents  │
└─────────┘              └─────────┘          └───────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Frontend**: Node.js 18+, npm
- **Backend**: Python 3.11+, FastAPI, MongoDB
- **RAG Pipeline**: R2R v3 running on localhost:7272

### 1. Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

**Runs on**: `http://localhost:3000`

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB and R2R URLs

# Start server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Runs on**: `http://localhost:8000`

### 3. R2R Pipeline (Required)

```bash
cd backend/R2R
# Follow R2R setup instructions
# Ensure R2R is running on localhost:7272 with compliance documents ingested
```

## 🛠️ API Endpoints

### Health & Status

#### `GET /health`
Get application health status
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "app_name": "SiLab API", 
  "version": "1.0.0"
}
```

### RAG Pipeline Endpoints

#### `GET /rag/health`
Check R2R service connectivity
```bash
curl http://localhost:8000/rag/health
```

#### `POST /rag/ingest`
Ingest new compliance documents
```bash
curl -X POST "http://localhost:8000/rag/ingest" \
  -F "file=@document.pdf"
```

#### `POST /rag/search`
Search through ingested documents
```bash
curl -X POST "http://localhost:8000/rag/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "BSP regulations on customer verification",
    "limit": 5
  }'
```

#### `POST /rag/chat`
RAG-powered chat completion
```bash
curl -X POST "http://localhost:8000/rag/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the AML requirements for digital wallets?",
    "use_hybrid_search": true,
    "task_prompt": "You are a Philippine compliance expert..."
  }'
```

### 🎯 Compliance Analysis Endpoints

#### `POST /compliance/analyze`
**Main endpoint** for document compliance analysis using semantic section analysis

```bash
curl -X POST "http://localhost:8000/compliance/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "product-proposal.txt",
    "document_content": "PRODUCT FEATURES\n1. INSTANT MONEY TRANSFERS\n- Send money to any mobile number without verification\n..."
  }'
```

**Request Body:**
```json
{
  "filename": "string",
  "document_content": "string"
}
```

**Response Format:**
```json
{
  "document_name": "product-proposal.txt",
  "analysis_date": "2025-08-24T21:30:00",
  "analysis_type": "semantic_sections",
  "total_sections_analyzed": 8,
  "sections_with_violations": 6,
  "total_violations": 23,
  "section_analyses": [
    {
      "sectionTitle": "INSTANT MONEY TRANSFERS",
      "sectionType": "feature",
      "startLine": 12,
      "endLine": 17,
      "status": "VIOLATION",
      "violationCount": 4,
      "analysis": "Full RAG analysis response...",
      "sectionAnalysis": "This section contains multiple AML violations...",
      "violationDetails": [
        "No customer verification violates RA 9160 AML requirements",
        "No transaction limits violates BSP banking regulations",
        "Anonymous transfers prohibited under customer due diligence rules"
      ],
      "businessImpact": "High regulatory risk, potential BSP enforcement action",
      "regulatoryRisk": "License revocation, heavy fines, criminal liability",
      "workarounds": [
        {
          "title": "Implement KYC Framework",
          "description": "Comprehensive customer verification system",
          "steps": ["Deploy identity verification", "Set transaction limits", "Monitor suspicious activity"],
          "regulatoryAlignment": "Ensures RA 9160 AML compliance",
          "businessBenefit": "Builds customer trust and regulatory approval"
        }
      ]
    }
  ],
  "regulatory_summary": {
    "compliance_score": 25.0,
    "status": "NON-COMPLIANT",
    "domains_affected": ["feature", "architecture", "data_privacy"],
    "business_impact_sections": [
      {
        "section": "INSTANT MONEY TRANSFERS",
        "violations": 4,
        "impact": "High regulatory risk",
        "risk": "License revocation"
      }
    ]
  },
  "violation_breakdown": {
    "feature": [/* Feature section violations */],
    "data_privacy": [/* Data privacy violations */],
    "architecture": [/* Technical violations */]
  }
}
```

#### `POST /compliance/upload-analyze`
Upload file and analyze
```bash
curl -X POST "http://localhost:8000/compliance/upload-analyze" \
  -F "file=@product-proposal.txt"
```

## 🎨 Frontend Routes

### Main Application Routes

- **`/`** - Product dashboard with compliance navigation
- **`/compliance`** - Main compliance analysis interface  
- **`/compliance/[product]`** - Product-specific compliance analysis (optional)

### Frontend Features

1. **Document Upload**: Drag & drop or file picker
2. **Real-time Analysis**: Progress tracking with debug info
3. **Smart Visualization**: Section-based violation display
4. **Export Capabilities**: Download analysis results as JSON
5. **Debug Tools**: Connection testing and endpoint discovery

## 📊 Analysis Features

### Semantic Section Analysis
- **Smart Parsing**: Automatically detects document sections
- **Context Preservation**: Analyzes features as complete business units
- **Targeted Analysis**: Section-specific regulatory focus
- **Business Impact**: Strategic recommendations vs technical fixes

### Section Types Detected
- **`feature`**: Product features and services 
- **`architecture`**: Technical implementation details
- **`compliance`**: Regulatory and legal frameworks
- **`business`**: Business models and strategies
- **`data_privacy`**: Customer data handling practices

### Regulatory Coverage
- **RA 9160** - Anti-Money Laundering Act
- **RA 10173** - Data Privacy Act  
- **BSP Banking Regulations** - Central bank requirements
- **SEC Securities Rules** - Investment regulations
- **Consumer Protection** - Customer rights and fair practices

## 🔧 Configuration

### Backend Environment Variables (.env)
```bash
# Application
APP_NAME=SiLab API
APP_VERSION=1.0.0
DEBUG=false

# Database
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=silab

# R2R Service
R2R_BASE_URL=http://localhost:7272

# CORS
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001

# Server
HOST=0.0.0.0
PORT=8000
```

### Frontend Configuration
- **API URL**: Automatically detects backend on localhost:8000
- **CORS**: Configured for development on ports 3000-3001
- **Debug Mode**: Toggle debug panels in compliance interface

## 🧪 Testing & Development

### Test Compliance Analysis
```bash
# Test with sample document
curl -X POST "http://localhost:8000/compliance/analyze" \
  -H "Content-Type: application/json" \
  -d @backend/sample_product_proposal.txt
```

### Debug Tools
1. **Frontend Debug Panel**: Click "Show Debug Info" in compliance interface
2. **Connection Testing**: Use "Test Backend Connection" button  
3. **Endpoint Discovery**: Use "Find API Endpoints" scanner
4. **Auto-download**: All responses automatically downloaded as JSON

### Test Files Provided
- `backend/sample_product_proposal.txt` - Sample document with violations
- `backend/test_*.py` - Various testing scripts
- `backend/Compliance Documents/` - Regulatory documents for R2R ingestion

## 📈 Performance

### Semantic Section Analysis Benefits
- **85% fewer API calls**: ~8-10 sections vs ~50 lines  
- **Faster processing**: ~30 seconds vs 2-3 minutes
- **Better accuracy**: Context-aware regulatory analysis
- **Business-focused**: Strategic recommendations vs technical fixes

### Scalability
- **MongoDB**: Document storage and user management
- **R2R RAG**: Scalable knowledge base with hybrid search
- **FastAPI**: Async processing with automatic rate limiting  
- **Next.js**: Optimized frontend with server-side rendering

## 🚀 Deployment

### Production Deployment
1. **Frontend**: Deploy to Vercel, Netlify, or similar
2. **Backend**: Deploy to Railway, Render, or cloud VPS
3. **Database**: MongoDB Atlas or self-hosted
4. **R2R**: Deploy R2R service with ingested compliance documents

### Environment URLs
- **Development**: localhost:3000 (frontend), localhost:8000 (backend)
- **Staging**: Configure staging environment URLs
- **Production**: Update FRONTEND_ORIGINS and API URLs

## 📝 License & Support

**License**: MIT License

**Support**: 
- Frontend issues: Check browser console and debug panels
- Backend issues: Check server logs and `/health` endpoints
- RAG issues: Verify R2R service on localhost:7272
- General questions: Review debug info and JSON response downloads

## 🔗 Related Projects

- **R2R**: RAG pipeline framework
- **FastAPI**: High-performance Python web framework  
- **Next.js**: React-based frontend framework
- **MongoDB**: NoSQL database for document storage

---

**Built with ❤️ for Philippine financial compliance**
