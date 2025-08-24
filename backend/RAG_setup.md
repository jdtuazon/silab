# RAG Pipeline Documentation - SiLab Compliance Analysis

## Overview
This document explains the current RAG (Retrieval-Augmented Generation) pipeline implementation for the SiLab compliance analysis system, including R2R integration, knowledge base setup, and the analysis workflow.

## Current Pipeline Architecture

```
Document Upload → Line-by-Line Processing → RAG Analysis → Violation Detection → File Output
     ↓                      ↓                    ↓               ↓                ↓
[sample_proposal.txt] → [Split lines] → [R2R Search+Completion] → [Parse results] → [JSON/TXT files]
```

## R2R (RAG to Riches) Integration

### What is R2R?
R2R is a production-ready RAG framework that provides:
- Document ingestion and chunking
- Vector embeddings and storage
- Hybrid search (vector + full-text)
- LLM completion with retrieved context
- RESTful API endpoints

### R2R Features We're Using

#### 1. Document Ingestion (`/v3/documents`)
- **Purpose**: Upload and process compliance documents
- **What we ingested**: 30 Philippine regulatory documents (PDFs)
- **Files include**: 
  - RA 9160 (Anti-Money Laundering Act)
  - RA 10173 (Data Privacy Act) 
  - BSP Circulars (Banking regulations)
  - SEC guidelines
- **Metadata**: Each document tagged with `document_type: compliance`

#### 2. Vector Search (`/v3/chunks/search`)
- **Purpose**: Find relevant regulatory text for each line
- **Search mode**: Hybrid search (semantic + full-text)
- **Query**: Each line from the product proposal
- **Results**: Top 3-5 most relevant regulatory chunks

#### 3. Completion (`/v3/retrieval/completion`)
- **Purpose**: Generate compliance analysis using retrieved context
- **Model**: `openai/gpt-4o-mini`
- **Input**: System prompt + User query + Retrieved regulatory context
- **Output**: Structured violation analysis

#### 4. Collections (`/v3/collections`)
- **Purpose**: Organize documents by category
- **Collection**: "Compliance Documents" - contains all Philippine regulations

## Pipeline Steps Breakdown

### Step 1: Document Ingestion (Setup Phase)
```python
# Process: PDF → Text Chunks → Vector Embeddings → Storage
ingest_compliance_docs.py
├── Read PDF files from "Compliance Documents/"
├── Extract text and create chunks
├── Generate embeddings for each chunk  
├── Store in R2R vector database
└── Create metadata associations
```

**What happens**:
- PDF text extracted using unstructured
- Documents chunked into ~500-1000 character segments
- Each chunk embedded using sentence transformers
- Chunks stored with metadata (filename, page, document type)

### Step 2: Embedding Process
```
PDF Document → Text Extraction → Chunking → Embedding → Vector DB
     ↓              ↓            ↓          ↓           ↓
[BSP_circular.pdf] → [raw text] → [chunks] → [vectors] → [stored]
```

**Embedding Model**: Default R2R embedding model (likely sentence-transformers)
**Vector Dimensions**: ~384 or 768 depending on model
**Similarity**: Cosine similarity for retrieval

### Step 3: Retrieval Process (Per Line Analysis)
```javascript
// For each line in the proposal:
line = "Send money without verification"
      ↓
searchQuery = {
  query: line,
  limit: 3,
  use_hybrid_search: true
}
      ↓
R2R finds relevant chunks:
- AML customer identification requirements
- BSP wire transfer regulations  
- Due diligence procedures
```

### Step 4: Generation Process
```javascript
// Context building:
context = retrieved_chunks.map(chunk => chunk.text).join('\n\n')
      ↓
messages = [
  {role: "system", content: taskPrompt},
  {role: "user", content: `Analyze: "${line}"\n\nRegulations:\n${context}`}
]
      ↓
LLM analyzes line against actual regulatory text
```

## Verification Commands

### Check if documents were ingested:
```bash
curl "http://localhost:7272/v3/documents?limit=5"
```

### Test search functionality:
```bash
curl -X POST "http://localhost:7272/v3/chunks/search" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "money transfer verification requirements",
       "search_settings": {"limit": 3}
     }'
```

### Test completion with context:
```bash
curl -X POST "http://localhost:7272/v3/retrieval/completion" \
     -H "Content-Type: application/json" \
     -d '{
       "messages": [
         {"role": "user", "content": "Does sending money without verification violate AML rules?"}
       ],
       "generation_config": {"model": "openai/gpt-4o-mini"}
     }'
```

## File Locations

- **R2R Service**: `r2r_service.py`
- **Ingestion Script**: `ingest_compliance_docs.py` 
- **HTML Interface**: `temp_chat_ui.html`
- **Compliance Documents**: `Compliance Documents/` (gitignored)
- **FastAPI Endpoints**: `main.py` (`/r2r/*` routes)

## R2R Configuration

- **Base URL**: `http://localhost:7272`
- **API Version**: v3
- **Model**: `openai/gpt-4o-mini`
- **Search**: Hybrid (vector + full-text)
- **Collection**: "Compliance Documents"