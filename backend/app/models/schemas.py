"""
Pydantic models for request/response schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestData(BaseModel):
    """Test data model"""
    name: str
    value: int
    category: str

class RAGQuery(BaseModel):
    """RAG query model"""
    query: str
    limit: int = 10
    use_hybrid_search: bool = True
    task_prompt: Optional[str] = None

class ComplianceAnalysisRequest(BaseModel):
    """Compliance analysis request model"""
    content: str
    filename: str
    analysis_type: str = "full"

class ComplianceViolation(BaseModel):
    """Compliance violation model"""
    line_number: int
    original_text: str
    violation_type: str
    compliance_issue: str
    regulatory_source: str
    severity: str = "medium"

class ComplianceAnalysisResult(BaseModel):
    """Compliance analysis result model"""
    document_name: str
    analysis_date: datetime
    total_lines: int
    violations_found: int
    compliance_status: str
    violations: list[ComplianceViolation]