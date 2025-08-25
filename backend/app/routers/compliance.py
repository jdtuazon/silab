"""
Compliance analysis endpoints - Semantic Section Analysis
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from datetime import datetime
from typing import Optional, List, Dict, Any
import asyncio
import re

from app.models.schemas import RAGQuery, ComplianceAnalysisRequest
from app.services.r2r_service import r2r_service

router = APIRouter(prefix="/compliance", tags=["compliance"])

class DocumentSection:
    def __init__(self, title: str, content: str, start_line: int, end_line: int, section_type: str):
        self.title = title
        self.content = content
        self.start_line = start_line
        self.end_line = end_line
        self.section_type = section_type  # 'feature', 'architecture', 'compliance', 'business', 'other'

def parse_document_sections(document_content: str) -> List[DocumentSection]:
    """Parse document into logical sections based on structure and content"""
    
    lines = document_content.split('\n')
    sections = []
    current_section_lines = []
    current_title = ""
    current_start_line = 1
    
    # Patterns to identify section headers
    header_patterns = [
        r'^[A-Z][A-Z\s]{2,}$',  # ALL CAPS headers
        r'^\d+\.\s*[A-Z][A-Z\s]+',  # Numbered sections like "1. INSTANT MONEY"
        r'^[A-Z][A-Z\s]+:$',  # Headers ending with colon
        r'^\s*[-=]{3,}\s*$',  # Separator lines
    ]
    
    def classify_section_type(title: str, content: str) -> str:
        """Classify section based on title and content"""
        title_lower = title.lower()
        content_lower = content.lower()
        
        # Feature sections
        if any(keyword in title_lower for keyword in ['feature', 'transfer', 'payment', 'onboarding', 'service', 'investment']):
            return 'feature'
        
        # Technical/Architecture sections  
        if any(keyword in title_lower for keyword in ['architecture', 'technical', 'security', 'database', 'api']):
            return 'architecture'
        
        # Compliance/Regulatory sections
        if any(keyword in title_lower for keyword in ['compliance', 'regulatory', 'legal', 'monitoring']):
            return 'compliance'
        
        # Business sections
        if any(keyword in title_lower for keyword in ['business', 'model', 'strategy', 'marketing', 'partnership']):
            return 'business'
        
        # Data handling sections
        if any(keyword in content_lower for keyword in ['customer data', 'biometric', 'privacy', 'data sharing']):
            return 'data_privacy'
            
        return 'other'
    
    def is_header_line(line: str) -> bool:
        """Check if a line is likely a section header"""
        line = line.strip()
        if not line or len(line) < 3:
            return False
            
        for pattern in header_patterns:
            if re.match(pattern, line):
                return True
        return False
    
    for i, line in enumerate(lines, 1):
        line_stripped = line.strip()
        
        # Check if this line is a section header
        if is_header_line(line_stripped) and current_section_lines:
            # Save the previous section
            if current_title and current_section_lines:
                section_content = '\n'.join(current_section_lines).strip()
                if section_content:  # Only create section if it has content
                    section_type = classify_section_type(current_title, section_content)
                    sections.append(DocumentSection(
                        title=current_title,
                        content=section_content,
                        start_line=current_start_line,
                        end_line=i-1,
                        section_type=section_type
                    ))
            
            # Start new section
            current_title = line_stripped
            current_section_lines = []
            current_start_line = i
            
        elif is_header_line(line_stripped) and not current_section_lines:
            # First header
            current_title = line_stripped
            current_start_line = i
            
        else:
            # Regular content line
            if line_stripped:  # Don't add empty lines
                current_section_lines.append(line_stripped)
    
    # Don't forget the last section
    if current_title and current_section_lines:
        section_content = '\n'.join(current_section_lines).strip()
        if section_content:
            section_type = classify_section_type(current_title, section_content)
            sections.append(DocumentSection(
                title=current_title,
                content=section_content,
                start_line=current_start_line,
                end_line=len(lines),
                section_type=section_type
            ))
    
    # If no sections were found, treat the whole document as one section
    if not sections:
        full_content = '\n'.join([line.strip() for line in lines if line.strip()])
        if full_content:
            sections.append(DocumentSection(
                title="Document Content",
                content=full_content,
                start_line=1,
                end_line=len(lines),
                section_type='other'
            ))
    
    return sections

async def analyze_section_compliance(section: DocumentSection) -> Dict[str, Any]:
    """Analyze a document section for compliance violations using targeted regulatory analysis"""
    
    # Create section-specific analysis prompt based on section type
    def get_analysis_prompt(section_type: str) -> str:
        base_prompt = """You are a Philippine financial compliance expert analyzing this business section for regulatory violations.

SECTION ANALYSIS:
Title: {title}
Type: {section_type}
Content: {content}

""".format(title=section.title, section_type=section.section_type, content=section.content)

        if section_type == 'feature':
            return base_prompt + """Focus on:
- AML/KYC requirements (RA 9160): Customer verification, transaction monitoring, suspicious activity reporting
- Consumer protection: Risk disclosure, fair pricing, customer rights
- Banking regulations: Proper authorization, transaction limits, security measures

Respond with violations found in this EXACT format:
SECTION_ANALYSIS: [Overall compliance assessment]
VIOLATIONS_FOUND: [number]
VIOLATION_DETAILS:
- [Specific violation 1 with regulatory source]
- [Specific violation 2 with regulatory source]
BUSINESS_IMPACT: [How these violations affect the business]
REGULATORY_RISK: [Potential regulatory consequences]"""

        elif section_type in ['data_privacy', 'architecture']:
            return base_prompt + """Focus on:
- Data Privacy Act (RA 10173): Consent, data minimization, security, retention limits
- BSP Data Privacy Guidelines: Customer data protection, cross-border transfers
- Cybersecurity requirements: Data encryption, access controls, breach notification

Respond in this EXACT format:
SECTION_ANALYSIS: [Overall data protection assessment]
VIOLATIONS_FOUND: [number]  
VIOLATION_DETAILS:
- [Specific violation 1 with regulatory source]
- [Specific violation 2 with regulatory source]
BUSINESS_IMPACT: [How these violations affect the business]
REGULATORY_RISK: [Potential regulatory consequences]"""

        elif section_type == 'compliance':
            return base_prompt + """Focus on:
- Compliance framework adequacy
- Regulatory reporting requirements
- Risk management procedures
- Oversight and governance

Respond in this EXACT format:
SECTION_ANALYSIS: [Overall compliance framework assessment]
VIOLATIONS_FOUND: [number]
VIOLATION_DETAILS:
- [Specific violation 1 with regulatory source]
- [Specific violation 2 with regulatory source]  
BUSINESS_IMPACT: [How these violations affect the business]
REGULATORY_RISK: [Potential regulatory consequences]"""

        else:
            return base_prompt + """Analyze against all applicable Philippine financial regulations including:
- RA 9160 (AML/CFT)
- RA 10173 (Data Privacy)
- BSP Banking Regulations
- SEC Securities Rules
- Consumer Protection Act

Respond in this EXACT format:
SECTION_ANALYSIS: [Overall compliance assessment]
VIOLATIONS_FOUND: [number]
VIOLATION_DETAILS:
- [Specific violation 1 with regulatory source]
- [Specific violation 2 with regulatory source]
BUSINESS_IMPACT: [How these violations affect the business] 
REGULATORY_RISK: [Potential regulatory consequences]"""

    try:
        prompt = get_analysis_prompt(section.section_type)
        
        result = await r2r_service.rag_completion(
            query=f"Analyze this {section.section_type} section for Philippine regulatory compliance: {section.title}",
            use_hybrid_search=True,
            task_prompt=prompt
        )
        
        completion = result.get('completion', '')
        
        # Parse the structured response
        violations_count = 0
        section_analysis = ""
        violation_details = []
        business_impact = ""
        regulatory_risk = ""
        
        lines = completion.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if line.startswith('SECTION_ANALYSIS:'):
                section_analysis = line.split(':', 1)[1].strip()
            elif line.startswith('VIOLATIONS_FOUND:'):
                violations_text = line.split(':', 1)[1].strip()
                violations_count = int(violations_text) if violations_text.isdigit() else 0
            elif line.startswith('VIOLATION_DETAILS:'):
                current_section = 'violations'
            elif line.startswith('BUSINESS_IMPACT:'):
                business_impact = line.split(':', 1)[1].strip()
                current_section = None
            elif line.startswith('REGULATORY_RISK:'):
                regulatory_risk = line.split(':', 1)[1].strip()
                current_section = None
            elif current_section == 'violations' and line.startswith('- '):
                violation_details.append(line[2:].strip())  # Remove "- " prefix
        
        # Generate workarounds for this section if violations found
        workarounds = []
        if violations_count > 0 and section_analysis:
            workarounds = await generate_section_workarounds(section, violation_details, section_analysis)
        
        return {
            "sectionTitle": section.title,
            "sectionType": section.section_type,
            "startLine": section.start_line,
            "endLine": section.end_line,
            "status": "VIOLATION" if violations_count > 0 else "COMPLIANT",
            "violationCount": violations_count,
            "analysis": completion,
            "sectionAnalysis": section_analysis,
            "violationDetails": violation_details,
            "businessImpact": business_impact,
            "regulatoryRisk": regulatory_risk,
            "workarounds": workarounds
        }
        
    except Exception as e:
        print(f"Error analyzing section {section.title}: {e}")
        return {
            "sectionTitle": section.title,
            "sectionType": section.section_type,
            "startLine": section.start_line,
            "endLine": section.end_line,
            "status": "ERROR",
            "violationCount": 0,
            "analysis": f"Error during analysis: {str(e)}",
            "sectionAnalysis": "Analysis failed",
            "violationDetails": [],
            "businessImpact": "Could not assess impact",
            "regulatoryRisk": "Could not assess risk",
            "workarounds": []
        }

async def generate_section_workarounds(section: DocumentSection, violation_details: List[str], section_analysis: str) -> List[Dict[str, Any]]:
    """Generate comprehensive workarounds for a section's compliance violations"""
    
    workaround_prompt = f"""You are a compliance consultant providing comprehensive solutions for this business section.

SECTION CONTEXT:
Title: {section.title}
Type: {section.section_type}
Analysis: {section_analysis}

VIOLATIONS TO ADDRESS:
{chr(10).join('- ' + detail for detail in violation_details)}

Generate exactly 3 strategic workaround approaches. Focus on business-practical solutions:

APPROACH 1:
TITLE: [Strategic approach name]
DESCRIPTION: [How this approach addresses the violations]
IMPLEMENTATION_STEPS: [Specific actions, separated by |]
REGULATORY_ALIGNMENT: [How this ensures compliance]
BUSINESS_BENEFIT: [Additional business value]

APPROACH 2:
TITLE: [Alternative strategic approach]
DESCRIPTION: [How this approach addresses the violations]  
IMPLEMENTATION_STEPS: [Specific actions, separated by |]
REGULATORY_ALIGNMENT: [How this ensures compliance]
BUSINESS_BENEFIT: [Additional business value]

APPROACH 3:
TITLE: [Third strategic approach]
DESCRIPTION: [How this approach addresses the violations]
IMPLEMENTATION_STEPS: [Specific actions, separated by |]  
REGULATORY_ALIGNMENT: [How this ensures compliance]
BUSINESS_BENEFIT: [Additional business value]

Focus on practical, implementable solutions that transform compliance challenges into business opportunities."""
    
    try:
        result = await r2r_service.rag_completion(
            query=f"How to make this {section.section_type} section compliant with Philippine regulations",
            use_hybrid_search=True,
            task_prompt=workaround_prompt
        )
        
        completion = result.get('completion', '')
        workarounds = []
        
        # Parse the structured response
        approaches = completion.split('APPROACH ')[1:]  # Skip empty first element
        
        for approach in approaches[:3]:  # Limit to 3 approaches
            lines = approach.strip().split('\n')
            title = ""
            description = ""
            steps = []
            regulatory_alignment = ""
            business_benefit = ""
            
            for line in lines:
                line = line.strip()
                if line.startswith('TITLE:'):
                    title = line.split(':', 1)[1].strip()
                elif line.startswith('DESCRIPTION:'):
                    description = line.split(':', 1)[1].strip()
                elif line.startswith('IMPLEMENTATION_STEPS:'):
                    steps_text = line.split(':', 1)[1].strip()
                    steps = [step.strip() for step in steps_text.split('|') if step.strip()]
                elif line.startswith('REGULATORY_ALIGNMENT:'):
                    regulatory_alignment = line.split(':', 1)[1].strip()
                elif line.startswith('BUSINESS_BENEFIT:'):
                    business_benefit = line.split(':', 1)[1].strip()
            
            if title and description:
                workarounds.append({
                    "title": title,
                    "description": description,
                    "steps": steps if steps else ["Implementation steps to be defined"],
                    "regulatoryAlignment": regulatory_alignment,
                    "businessBenefit": business_benefit
                })
        
        # Fallback workarounds if parsing failed
        if not workarounds:
            workarounds = [
                {
                    "title": f"Regulatory Alignment for {section.section_type.title()} Section",
                    "description": "Comprehensive review and alignment with applicable regulations",
                    "steps": ["Conduct regulatory gap analysis", "Implement compliance controls", "Document procedures"],
                    "regulatoryAlignment": "Ensures full regulatory compliance",
                    "businessBenefit": "Reduces regulatory risk and builds customer trust"
                }
            ]
        
        return workarounds[:3]
        
    except Exception as e:
        print(f"Error generating section workarounds: {e}")
        return [
            {
                "title": f"Section Compliance Review - {section.title}",
                "description": "Professional compliance review and remediation",
                "steps": ["Engage compliance specialists", "Review section requirements", "Implement recommendations"],
                "regulatoryAlignment": "Addresses regulatory requirements",
                "businessBenefit": "Ensures regulatory compliance and business continuity"
            }
        ]

async def generate_workaround_suggestions(original_text: str, compliance_issue: str, regulatory_source: str) -> List[Dict[str, Any]]:
    """Generate 3 workaround suggestions for a compliance violation"""
    
    workaround_prompt = f"""You are a compliance consultant providing workaround solutions for Philippine financial regulations.

VIOLATION DETAILS:
- Original problematic text: "{original_text}"
- Compliance issue: {compliance_issue}
- Regulatory source: {regulatory_source}

Generate exactly 3 practical workaround suggestions to make this compliant. For each suggestion, provide:

SUGGESTION 1:
TITLE: [Short descriptive title]
DESCRIPTION: [Brief explanation of the solution]
STEPS: [Specific implementation steps, separated by |]
BENEFIT: [Why this approach ensures compliance]

SUGGESTION 2:
TITLE: [Short descriptive title] 
DESCRIPTION: [Brief explanation of the solution]
STEPS: [Specific implementation steps, separated by |]
BENEFIT: [Why this approach ensures compliance]

SUGGESTION 3:
TITLE: [Short descriptive title]
DESCRIPTION: [Brief explanation of the solution] 
STEPS: [Specific implementation steps, separated by |]
BENEFIT: [Why this approach ensures compliance]

Focus on practical, implementable solutions that directly address the regulatory requirements."""

    try:
        result = await r2r_service.rag_completion(
            query=f"How to make this compliant with Philippine regulations: {original_text}",
            use_hybrid_search=True,
            task_prompt=workaround_prompt
        )
        
        completion = result.get('completion', '')
        workarounds = []
        
        # Parse the structured response
        suggestions = completion.split('SUGGESTION ')[1:]  # Skip empty first element
        
        for i, suggestion in enumerate(suggestions[:3], 1):  # Limit to 3 suggestions
            lines = suggestion.strip().split('\n')
            title = ""
            description = ""
            steps = []
            benefit = ""
            
            for line in lines:
                if line.startswith('TITLE:'):
                    title = line.split(':', 1)[1].strip()
                elif line.startswith('DESCRIPTION:'):
                    description = line.split(':', 1)[1].strip()
                elif line.startswith('STEPS:'):
                    steps_text = line.split(':', 1)[1].strip()
                    steps = [step.strip() for step in steps_text.split('|') if step.strip()]
                elif line.startswith('BENEFIT:'):
                    benefit = line.split(':', 1)[1].strip()
            
            if title and description:  # Only add if we have minimum required fields
                workarounds.append({
                    "title": title,
                    "description": description,
                    "steps": steps if steps else ["Implementation steps not provided"],
                    "benefit": benefit if benefit else "Helps achieve regulatory compliance"
                })
        
        # If parsing failed, provide generic workarounds
        if not workarounds:
            workarounds = [
                {
                    "title": "Add Compliance Controls",
                    "description": "Implement proper verification and compliance measures",
                    "steps": ["Review regulatory requirements", "Add necessary verification steps", "Document compliance procedures"],
                    "benefit": "Ensures adherence to regulatory standards"
                },
                {
                    "title": "Enhance Documentation",
                    "description": "Improve documentation to clearly state compliance measures", 
                    "steps": ["Add regulatory disclaimers", "Document verification processes", "Include compliance certifications"],
                    "benefit": "Provides transparency and demonstrates compliance commitment"
                },
                {
                    "title": "Consult Legal Team",
                    "description": "Seek professional legal review for regulatory compliance",
                    "steps": ["Engage compliance specialists", "Review with legal counsel", "Implement recommended changes"],
                    "benefit": "Ensures professional oversight and regulatory alignment"
                }
            ]
        
        return workarounds[:3]  # Ensure exactly 3 suggestions
        
    except Exception as e:
        print(f"Error generating workarounds: {e}")
        # Return fallback suggestions
        return [
            {
                "title": "Review Regulatory Requirements",
                "description": "Conduct thorough review of applicable regulations",
                "steps": ["Identify relevant laws", "Assess current compliance gaps", "Develop remediation plan"],
                "benefit": "Provides foundation for regulatory compliance"
            },
            {
                "title": "Implement Compliance Controls",
                "description": "Add necessary controls and verification processes",
                "steps": ["Design control framework", "Implement verification steps", "Test compliance measures"],
                "benefit": "Establishes proper regulatory safeguards"
            },
            {
                "title": "Seek Professional Guidance",
                "description": "Consult with compliance and legal professionals",
                "steps": ["Engage regulatory experts", "Review compliance strategy", "Implement professional recommendations"],
                "benefit": "Ensures expert oversight and regulatory alignment"
            }
        ]

async def analyze_line_for_compliance(line: str, line_number: int) -> Dict[str, Any]:
    """Analyze a single line for compliance violations using the existing RAG pipeline"""
    
    # Skip empty or very short lines
    if not line.strip() or len(line.strip()) < 10:
        return {
            "lineNumber": line_number,
            "originalText": line.strip(),
            "status": "COMPLIANT",
            "violations": 0,
            "analysis": "Line too short for meaningful analysis",
            "complianceIssue": "No content to analyze",
            "regulatorySource": "N/A"
        }
    
    # Create structured task prompt (based on your existing tests)
    task_prompt = """You are a compliance violation detector for Philippine financial regulations.

INSTRUCTIONS:
1. Analyze the provided line against Philippine laws (RA 9160 AML, RA 10173 Data Privacy, BSP Banking Rules, SEC Regulations)
2. If violations are found, respond in this EXACT format:
   VIOLATIONS_FOUND: 1
   VIOLATION_TEXT: [quote the exact problematic part]
   COMPLIANCE_ISSUE: [explain the specific violation]
   REGULATORY_SOURCE: [cite the specific law/regulation from the documents]

3. If no violations, respond:
   VIOLATIONS_FOUND: 0
   REASON: [brief explanation why it's compliant]

Be direct and specific. Focus on regulatory violations based on the retrieved documents."""
    
    try:
        # Use the existing RAG pipeline through r2r_service
        query = f'Analyze this line for Philippine regulatory violations: "{line.strip()}"'
        
        result = await r2r_service.rag_completion(
            query=query,
            use_hybrid_search=True,
            task_prompt=task_prompt
        )
        
        completion = result.get('completion', '')
        
        # Parse the response
        violations = 0
        compliance_issue = "No issues detected"
        regulatory_source = "N/A"
        status = "COMPLIANT"
        
        # Check for violations
        if "VIOLATIONS_FOUND:" in completion:
            violation_lines = [l for l in completion.split('\n') if 'VIOLATIONS_FOUND:' in l]
            if violation_lines:
                violation_count = violation_lines[0].split(':')[1].strip()
                if violation_count != "0":
                    violations = int(violation_count) if violation_count.isdigit() else 1
                    status = "VIOLATION"
        
        # Extract compliance issue
        if "COMPLIANCE_ISSUE:" in completion:
            issue_lines = [l for l in completion.split('\n') if 'COMPLIANCE_ISSUE:' in l]
            if issue_lines:
                compliance_issue = issue_lines[0].split(':', 1)[1].strip()
        elif "REASON:" in completion:
            reason_lines = [l for l in completion.split('\n') if 'REASON:' in l]
            if reason_lines:
                compliance_issue = reason_lines[0].split(':', 1)[1].strip()
        
        # Extract regulatory source
        if "REGULATORY_SOURCE:" in completion:
            source_lines = [l for l in completion.split('\n') if 'REGULATORY_SOURCE:' in l]
            if source_lines:
                regulatory_source = source_lines[0].split(':', 1)[1].strip()
        
        # If violation found, generate workaround suggestions
        workarounds = []
        if status == "VIOLATION":
            workarounds = await generate_workaround_suggestions(line.strip(), compliance_issue, regulatory_source)
        
        return {
            "lineNumber": line_number,
            "originalText": line.strip(),
            "status": status,
            "violations": violations,
            "analysis": completion,
            "complianceIssue": compliance_issue,
            "regulatorySource": regulatory_source,
            "workarounds": workarounds
        }
        
    except Exception as e:
        print(f"Error analyzing line {line_number}: {e}")
        return {
            "lineNumber": line_number,
            "originalText": line.strip(),
            "status": "ERROR",
            "violations": 0,
            "analysis": f"Error during analysis: {str(e)}",
            "complianceIssue": "Analysis failed",
            "regulatorySource": "N/A",
            "workarounds": []
        }

@router.post("/analyze")
async def analyze_compliance(request: ComplianceAnalysisRequest):
    """Analyze document content for compliance violations using semantic section analysis"""
    try:
        print(f"📄 Starting semantic section analysis for: {request.filename}")
        
        # Get document content
        document_content = request.content
        if not document_content:
            raise HTTPException(status_code=400, detail="No document content provided")
        
        print(f"📝 Document content length: {len(document_content)} characters")
        
        # Parse document into semantic sections
        sections = parse_document_sections(document_content)
        print(f"📋 Parsed document into {len(sections)} semantic sections")
        
        # Log section breakdown
        for section in sections:
            print(f"  📍 Section: {section.title} (Type: {section.section_type}, Lines: {section.start_line}-{section.end_line})")
        
        # Analyze each section
        section_analyses = []
        
        for i, section in enumerate(sections, 1):
            print(f"🔍 Analyzing section {i}/{len(sections)}: {section.title}")
            
            # Analyze the section
            result = await analyze_section_compliance(section)
            section_analyses.append(result)
            
            # Small delay to manage API rate limits
            await asyncio.sleep(0.2)
        
        print(f"✅ Section analysis complete. Processed {len(section_analyses)} sections")
        
        # Calculate summary statistics
        total_violations = sum(result['violationCount'] for result in section_analyses)
        total_sections = len(section_analyses)
        sections_with_violations = sum(1 for result in section_analyses if result['status'] == 'VIOLATION')
        
        # Group violations by regulatory domain
        regulatory_domains = {}
        business_sections = []
        
        for analysis in section_analyses:
            if analysis['status'] == 'VIOLATION':
                section_type = analysis['sectionType']
                if section_type not in regulatory_domains:
                    regulatory_domains[section_type] = []
                regulatory_domains[section_type].append(analysis)
                
                business_sections.append({
                    "section": analysis['sectionTitle'],
                    "violations": analysis['violationCount'],
                    "impact": analysis['businessImpact'],
                    "risk": analysis['regulatoryRisk']
                })
        
        compliance_score = round(((total_sections - sections_with_violations) / total_sections * 100), 2) if total_sections > 0 else 100
        
        return {
            "document_name": request.filename,
            "analysis_date": datetime.utcnow(),
            "analysis_type": "semantic_sections",
            "total_sections_analyzed": total_sections,
            "sections_with_violations": sections_with_violations,
            "total_violations": total_violations,
            "section_analyses": section_analyses,
            "regulatory_summary": {
                "compliance_score": compliance_score,
                "status": "NON-COMPLIANT" if sections_with_violations > 0 else "COMPLIANT",
                "domains_affected": list(regulatory_domains.keys()),
                "business_impact_sections": business_sections
            },
            "violation_breakdown": regulatory_domains
        }
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-analyze")
async def upload_and_analyze(file: UploadFile = File(...)):
    """Upload document and analyze for compliance"""
    try:
        content = await file.read()
        text_content = content.decode('utf-8')
        
        # Process the document
        return {
            "filename": file.filename,
            "size": len(content),
            "content_preview": text_content[:200] + "..." if len(text_content) > 200 else text_content,
            "message": "Document uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))