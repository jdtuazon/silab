import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from pydantic import BaseModel, Field
from ..services.product_extractor import ProductExtractor
from ..services.llm_extractor import LLMExtractor
from ..services.similar_products import build_sample_similar_products, rank_similar_products
from ..models.product import (
    Product, ProductType, ComplianceStatus, RewardsType,
    TargetSegment, DistributionChannel, LoanPurpose,
    RepaymentSchedule, TargetDemographics,
    AmountRange, TenureRange,
    CreditCardAttributes, PersonalLoanAttributes,
    MicrofinanceLoanAttributes, SavingsAccountAttributes
)
from ..models.product_text_file import ProductTextFile
from ..models.schemas import (
    SynMarketRequest,
    SynMarketResponse,
    MarketOpportunitySection,
)
from ..services.synmarket_service import generate_synmarket as synmarket_pipeline
router = APIRouter(prefix="/products", tags=["products"])
class ExtractHintsResponse(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    amount_range: Optional[dict] = None
    tenure_range: Optional[dict] = None
    interest_rate: Optional[dict] = None
    collateral_required: Optional[bool] = None
    target_segments: Optional[List[str]] = None
    compliance_status: Optional[str] = None

@router.post("/{product_id}/extract-hints", response_model=ExtractHintsResponse, tags=["products"])
async def extract_hints_for_product(product_id: str, file: UploadFile = File(...)):
    """Return lightweight structured hints from a PDF without storing anything."""
    try:
        product = Product.objects(id=product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")

        # 1) Try heuristic extractor
        extractor = ProductExtractor()
        info = extractor.extract_product_info(contents)
        # 2) If name is missing or confidence low, optionally call LLM if configured
        try:
            missing_core = not info.get('name') or not info.get('type')
            llm = LLMExtractor()
            if missing_core and llm.is_configured():
                raw_text, _ = extractor._extract_text_from_pdf(contents)
                llm_result = await llm.extract(raw_text)
                # Merge conservatively: prefer heuristic non-null values
                def choose(a, b):
                    return a if a not in (None, '', []) else b
                merged = {
                    'name': choose(info.get('name'), llm_result.get('name')),
                    'type': choose(info.get('type'), llm_result.get('type')),
                    'description': choose(info.get('description'), llm_result.get('description')),
                    'amount_range': choose(info.get('amount_range'), llm_result.get('amount_range')),
                    'tenure_range': choose(info.get('tenure_range'), llm_result.get('tenure_range')),
                    'interest_rate': choose(info.get('interest_rate'), llm_result.get('interest_rate')),
                    'collateral_required': choose(info.get('collateral_required'), llm_result.get('collateral_required')),
                    'target_segments': choose(info.get('target_segments'), llm_result.get('target_segments')),
                    'compliance_status': choose(info.get('compliance_status'), llm_result.get('compliance_status')),
                }
                info = merged
        except Exception:
            # Ignore LLM errors; return heuristic result
            pass

        def serialize_value(value):
            try:
                return value.value
            except Exception:
                return value

        return ExtractHintsResponse(
            name=info.get('name'),
            type=serialize_value(info.get('type')) if info.get('type') else None,
            description=info.get('description'),
            amount_range=info.get('amount_range'),
            tenure_range=info.get('tenure_range'),
            interest_rate=info.get('interest_rate'),
            collateral_required=info.get('collateral_required'),
            target_segments=info.get('target_segments'),
            compliance_status=serialize_value(info.get('compliance_status')) if info.get('compliance_status') else None,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-synmarket", response_model=SynMarketResponse, tags=["products"])
async def generate_synmarket(payload: SynMarketRequest):
    """
    Generate Market Opportunity, Similar Products, Virtual Persona, and SiLab Insights
    in one JSON response using an LLM. Returns strictly-typed JSON per schema.
    """
    try:
        try:
            return await synmarket_pipeline(payload)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 


# Pydantic models for request/response
class AmountRangeSchema(BaseModel):
    min: float = Field(..., description="Minimum amount")
    max: float = Field(..., description="Maximum amount")

    class Config:
        json_schema_extra = {
            "example": {
                "min": 1000.0,
                "max": 50000.0
            }
        }

class TenureRangeSchema(BaseModel):
    min: float = Field(..., description="Minimum tenure")
    max: float = Field(..., description="Maximum tenure")

    class Config:
        json_schema_extra = {
            "example": {
                "min": 12.0,
                "max": 60.0
            }
        }

class CreditCardAttributesSchema(BaseModel):
    credit_limit_range: AmountRangeSchema
    annual_fee: float
    interest_rate_apr: float
    rewards_type: RewardsType
    target_segment: List[TargetSegment]
    distribution_channel: List[DistributionChannel]

class PersonalLoanAttributesSchema(BaseModel):
    loan_amount_range: AmountRangeSchema
    interest_rate_apr: float
    tenure_range_months: TenureRangeSchema
    collateral_required: bool
    purpose: List[LoanPurpose]
    distribution_channel: List[DistributionChannel]

class MicrofinanceLoanAttributesSchema(BaseModel):
    loan_amount_range: AmountRangeSchema
    group_lending: bool
    collateral_required: bool
    repayment_schedule: RepaymentSchedule
    distribution_channel: List[DistributionChannel]
    target_demographics: List[TargetDemographics]
    financial_literacy_support: bool

class SavingsAccountAttributesSchema(BaseModel):
    minimum_balance: Optional[float] = None
    interest_rate: Optional[float] = None

class ProductSchema(BaseModel):
    name: str = Field(..., description="Name of the product")
    type: ProductType = Field(..., description="Type of financial product")
    description: str = Field(..., description="Product description")
    target_personas: List[str] = Field(..., description="Product tags/personas")
    compliance_status: ComplianceStatus = Field(..., description="Current compliance status")
    credit_card_attributes: Optional[CreditCardAttributesSchema] = None
    personal_loan_attributes: Optional[PersonalLoanAttributesSchema] = None
    microfinance_loan_attributes: Optional[MicrofinanceLoanAttributesSchema] = None
    savings_account_attributes: Optional[SavingsAccountAttributesSchema] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Premium Rewards Card",
                "type": "CreditCard",
                "description": "Premium credit card with rewards",
                "target_personas": ["Young Professionals", "Affluent"],
                "compliance_status": "Compliant",
                "credit_card_attributes": {
                    "credit_limit_range": {"min": 10000, "max": 50000},
                    "annual_fee": 99.99,
                    "interest_rate_apr": 18.99,
                    "rewards_type": "Points",
                    "target_segment": ["Affluent", "YoungProfessionals"],
                    "distribution_channel": ["Branch", "Online"]
                }
            }
        }

def _serialize_amount_range(amount_range) -> dict:
    """Serialize AmountRange embedded document"""
    if not amount_range:
        return None
    return {
        "min": amount_range.min,
        "max": amount_range.max
    }

def _serialize_tenure_range(tenure_range) -> dict:
    """Serialize TenureRange embedded document"""
    if not tenure_range:
        return None
    return {
        "min": tenure_range.min,
        "max": tenure_range.max
    }

def _serialize_credit_card_attributes(attrs) -> dict:
    """Serialize CreditCardAttributes embedded document"""
    if not attrs:
        return None
    return {
        "credit_limit_range": _serialize_amount_range(attrs.credit_limit_range),
        "annual_fee": attrs.annual_fee,
        "interest_rate_apr": attrs.interest_rate_apr,
        "rewards_type": attrs.rewards_type,
        "target_segment": [str(segment) for segment in attrs.target_segment],
        "distribution_channel": [str(channel) for channel in attrs.distribution_channel]
    }

def _serialize_personal_loan_attributes(attrs) -> dict:
    """Serialize PersonalLoanAttributes embedded document"""
    if not attrs:
        return None
    return {
        "loan_amount_range": _serialize_amount_range(attrs.loan_amount_range),
        "interest_rate_apr": attrs.interest_rate_apr,
        "tenure_range_months": _serialize_tenure_range(attrs.tenure_range_months),
        "collateral_required": attrs.collateral_required,
        "purpose": [str(purpose) for purpose in attrs.purpose],
        "distribution_channel": [str(channel) for channel in attrs.distribution_channel]
    }

def _serialize_microfinance_loan_attributes(attrs) -> dict:
    """Serialize MicrofinanceLoanAttributes embedded document"""
    if not attrs:
        return None
    return {
        "loan_amount_range": _serialize_amount_range(attrs.loan_amount_range),
        "group_lending": attrs.group_lending,
        "collateral_required": attrs.collateral_required,
        "repayment_schedule": str(attrs.repayment_schedule),
        "distribution_channel": [str(channel) for channel in attrs.distribution_channel],
        "target_demographics": [str(demographic) for demographic in attrs.target_demographics],
        "financial_literacy_support": attrs.financial_literacy_support
    }

def _serialize_savings_account_attributes(attrs) -> dict:
    """Serialize SavingsAccountAttributes embedded document"""
    if not attrs:
        return None
    return {
        "minimum_balance": attrs.minimum_balance,
        "interest_rate": attrs.interest_rate
    }

def _map_product_to_response(product: Product) -> dict:
    """Map a Product document to a response dictionary"""
    response = {
        "id": str(product.id),
        "name": product.name,
        "type": str(product.type),
        "description": product.description,
        "target_personas": product.target_personas,
        "compliance_status": str(product.compliance_status),
        "created_at": product.created_at.isoformat() if product.created_at else None,
        "updated_at": product.updated_at.isoformat() if product.updated_at else None,
    }

    # Add type-specific attributes
    if product.type == ProductType.CREDIT_CARD:
        response["credit_card_attributes"] = _serialize_credit_card_attributes(product.credit_card_attributes)
    elif product.type == ProductType.PERSONAL_LOAN:
        response["personal_loan_attributes"] = _serialize_personal_loan_attributes(product.personal_loan_attributes)
    elif product.type == ProductType.MICROFINANCE_LOAN:
        response["microfinance_loan_attributes"] = _serialize_microfinance_loan_attributes(product.microfinance_loan_attributes)
    elif product.type == ProductType.SAVINGS_ACCOUNT:
        response["savings_account_attributes"] = _serialize_savings_account_attributes(product.savings_account_attributes)

    return response

@router.post("/", response_model=dict)
async def create_product(product: ProductSchema):
    """Create a new financial product"""
    try:
        def save_product():
            # Create the product with base fields
            new_product = Product(
                name=product.name,
                type=product.type,
                description=product.description,
                target_personas=product.target_personas,
                compliance_status=product.compliance_status,
            )

            # Add type-specific attributes
            if product.type == ProductType.CREDIT_CARD:
                if not product.credit_card_attributes:
                    raise HTTPException(
                        status_code=400,
                        detail="credit_card_attributes required for CreditCard type"
                    )
                new_product.credit_card_attributes = CreditCardAttributes(
                    **product.credit_card_attributes.dict()
                )
            elif product.type == ProductType.PERSONAL_LOAN:
                if not product.personal_loan_attributes:
                    raise HTTPException(
                        status_code=400,
                        detail="personal_loan_attributes required for PersonalLoan type"
                    )
                new_product.personal_loan_attributes = PersonalLoanAttributes(
                    **product.personal_loan_attributes.dict()
                )
            elif product.type == ProductType.MICROFINANCE_LOAN:
                if not product.microfinance_loan_attributes:
                    raise HTTPException(
                        status_code=400,
                        detail="microfinance_loan_attributes required for MicrofinanceLoan type"
                    )
                new_product.microfinance_loan_attributes = MicrofinanceLoanAttributes(
                    **product.microfinance_loan_attributes.dict()
                )
            elif product.type == ProductType.SAVINGS_ACCOUNT:
                if product.savings_account_attributes:
                    new_product.savings_account_attributes = SavingsAccountAttributes(
                        **product.savings_account_attributes.dict()
                    )

            new_product.save()
            return new_product

        # Run the synchronous mongoengine operation in a thread pool
        with ThreadPoolExecutor() as executor:
            new_product = await asyncio.get_event_loop().run_in_executor(executor, save_product)
            
        return _map_product_to_response(new_product)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[dict])
async def list_products(
    type: Optional[ProductType] = None,
    compliance_status: Optional[ComplianceStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    """List financial products with optional filtering"""
    try:
        from concurrent.futures import ThreadPoolExecutor
        from functools import partial

        def fetch_products():
            # Build query filters
            filters = {}
            if type:
                filters["type"] = type
            if compliance_status:
                filters["compliance_status"] = compliance_status

            # Execute query with pagination
            products = Product.objects(**filters).skip(skip).limit(limit)
            return [_map_product_to_response(product) for product in products]

        # Run the synchronous mongoengine operation in a thread pool
        with ThreadPoolExecutor() as executor:
            result = await asyncio.get_event_loop().run_in_executor(executor, fetch_products)
            
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=dict)
async def get_product(product_id: str):
    """Get a specific financial product by ID"""
    try:
        def fetch_product():
            product = Product.objects(id=product_id).first()
            if not product:
                return None
            return product

        # Run the synchronous mongoengine operation in a thread pool
        with ThreadPoolExecutor() as executor:
            product = await asyncio.get_event_loop().run_in_executor(executor, fetch_product)

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        return _map_product_to_response(product)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/extract-text", response_model=dict, tags=["products"])
async def extract_product_text(file: UploadFile = File(...)):
    """
    Accept a PDF and return a clean, human-readable text representation of the product
    (no binary storage). Example output lines like:
    "Product Title:\nPremium Rewards Card"
    "Product Type:\nCreditCard"
    "Description:\n..."
    """
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")

        extractor = ProductExtractor()
        # Extract raw text as-is (no restructuring)
        text_output, _ = extractor._extract_text_from_pdf(contents)
        return {
            "filename": file.filename,
            "text": text_output,
            "metadata": {},
            "confidence": {},
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.post("/{product_id}/files", tags=["products"], response_model=dict)
async def create_product_text_file(product_id: str, file: UploadFile = File(...)):
    """Upload a PDF, extract text summary, and store as a text-only product file linked to the product."""
    try:
        product = Product.objects(id=product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")

        extractor = ProductExtractor()
        # Extract raw text as-is (no restructuring)
        text_output, _ = extractor._extract_text_from_pdf(contents)

        def save_doc():
            doc = ProductTextFile(
                product=product,
                filename=file.filename,
                content_type=file.content_type or "application/pdf",
                size=len(contents),
                text=text_output,
            )
            doc.save()
            return doc

        with ThreadPoolExecutor() as executor:
            saved = await asyncio.get_event_loop().run_in_executor(executor, save_doc)

        return {
            "id": str(saved.id),
            "product_id": str(product.id),
            "filename": saved.filename,
            "content_type": saved.content_type,
            "size": saved.size,
            "uploaded_at": saved.uploaded_at.isoformat() if saved.uploaded_at else None,
            "text": saved.text,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}/files", tags=["products"], response_model=List[dict])
async def list_product_text_files(product_id: str):
    """List text-only product files for a product (metadata only)."""
    try:
        product = Product.objects(id=product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        def fetch_docs():
            docs = ProductTextFile.objects(product=product).order_by("-uploaded_at")
            return [
                {
                    "id": str(d.id),
                    "filename": d.filename,
                    "size": d.size,
                    "uploaded_at": d.uploaded_at.isoformat() if d.uploaded_at else None,
                }
                for d in docs
            ]

        with ThreadPoolExecutor() as executor:
            result = await asyncio.get_event_loop().run_in_executor(executor, fetch_docs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files/{file_id}", tags=["products"], response_model=dict)
async def get_product_text_file(file_id: str):
    """Get a single text-only product file (full text)."""
    try:
        def fetch_doc():
            return ProductTextFile.objects(id=file_id).first()

        with ThreadPoolExecutor() as executor:
            doc = await asyncio.get_event_loop().run_in_executor(executor, fetch_doc)

        if not doc:
            raise HTTPException(status_code=404, detail="File not found")

        return {
            "id": str(doc.id),
            "filename": doc.filename,
            "content_type": doc.content_type,
            "size": doc.size,
            "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
            "text": doc.text,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{product_id}", response_model=dict)
async def update_product(product_id: str, product_update: ProductSchema):
    """Update a financial product"""
    try:
        existing_product = Product.objects(id=product_id).first()
        if not existing_product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Update base fields
        existing_product.name = product_update.name
        existing_product.description = product_update.description
        existing_product.target_personas = product_update.target_personas
        existing_product.compliance_status = product_update.compliance_status

        # Handle type-specific attributes
        if product_update.type != existing_product.type:
            raise HTTPException(
                status_code=400,
                detail="Cannot change product type after creation"
            )

        if existing_product.type == ProductType.CREDIT_CARD:
            if not product_update.credit_card_attributes:
                raise HTTPException(
                    status_code=400,
                    detail="credit_card_attributes required for CreditCard type"
                )
            existing_product.credit_card_attributes = CreditCardAttributes(
                **product_update.credit_card_attributes.dict()
            )
        elif existing_product.type == ProductType.PERSONAL_LOAN:
            if not product_update.personal_loan_attributes:
                raise HTTPException(
                    status_code=400,
                    detail="personal_loan_attributes required for PersonalLoan type"
                )
            existing_product.personal_loan_attributes = PersonalLoanAttributes(
                **product_update.personal_loan_attributes.dict()
            )
        elif existing_product.type == ProductType.MICROFINANCE_LOAN:
            if not product_update.microfinance_loan_attributes:
                raise HTTPException(
                    status_code=400,
                    detail="microfinance_loan_attributes required for MicrofinanceLoan type"
                )
            existing_product.microfinance_loan_attributes = MicrofinanceLoanAttributes(
                **product_update.microfinance_loan_attributes.dict()
            )
        elif existing_product.type == ProductType.SAVINGS_ACCOUNT:
            if product_update.savings_account_attributes:
                existing_product.savings_account_attributes = SavingsAccountAttributes(
                    **product_update.savings_account_attributes.dict()
                )

        existing_product.save()
        return _map_product_to_response(existing_product)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete a financial product"""
    try:
        product = Product.objects(id=product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product.delete()
        return {"message": "Product deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sample", response_model=dict, tags=["administration"])
async def create_sample_products():
    """Populate the database with sample products for testing"""
    try:
        # Sample Credit Card
        credit_card = Product(
            name="Premium Rewards Card",
            type=ProductType.CREDIT_CARD,
            description="Premium credit card with exclusive rewards and benefits",
            target_personas=["Young Professionals", "Affluent"],
            compliance_status=ComplianceStatus.COMPLIANT,
            credit_card_attributes=CreditCardAttributes(
                credit_limit_range=AmountRange(min=10000, max=50000),
                annual_fee=99.99,
                interest_rate_apr=18.99,
                rewards_type=RewardsType.POINTS,
                target_segment=[TargetSegment.AFFLUENT, TargetSegment.YOUNG_PROFESSIONALS],
                distribution_channel=[DistributionChannel.BRANCH, DistributionChannel.ONLINE]
            )
        )

        # Sample Personal Loan
        personal_loan = Product(
            name="Education First Loan",
            type=ProductType.PERSONAL_LOAN,
            description="Personal loan designed for education expenses",
            target_personas=["Students", "Parents"],
            compliance_status=ComplianceStatus.PENDING_REVIEW,
            personal_loan_attributes=PersonalLoanAttributes(
                loan_amount_range=AmountRange(min=5000, max=100000),
                interest_rate_apr=12.5,
                tenure_range_months=TenureRange(min=12, max=60),
                collateral_required=False,
                purpose=[LoanPurpose.EDUCATION],
                distribution_channel=[
                    DistributionChannel.BRANCH,
                    DistributionChannel.MOBILE_APP
                ]
            )
        )

        # Sample Microfinance Loan
        microfinance_loan = Product(
            name="Rural Business Empowerment Loan",
            type=ProductType.MICROFINANCE_LOAN,
            description="Group-based microfinance loan for rural entrepreneurs",
            target_personas=["Small Business Owners", "Rural Entrepreneurs"],
            compliance_status=ComplianceStatus.COMPLIANT,
            microfinance_loan_attributes=MicrofinanceLoanAttributes(
                loan_amount_range=AmountRange(min=1000, max=10000),
                group_lending=True,
                collateral_required=False,
                repayment_schedule=RepaymentSchedule.WEEKLY,
                distribution_channel=[
                    DistributionChannel.AGENT,
                    DistributionChannel.MOBILE_APP
                ],
                target_demographics=[
                    TargetDemographics.RURAL,
                    TargetDemographics.WOMEN,
                    TargetDemographics.INFORMAL_WORKERS
                ],
                financial_literacy_support=True
            )
        )

        # Sample Savings Account
        savings_account = Product(
            name="Youth Saver Account",
            type=ProductType.SAVINGS_ACCOUNT,
            description="High-interest savings account for young savers",
            target_personas=["Students", "Young Professionals"],
            compliance_status=ComplianceStatus.COMPLIANT,
            savings_account_attributes=SavingsAccountAttributes(
                minimum_balance=500,
                interest_rate=4.5
            )
        )

        # Save all products
        products = [credit_card, personal_loan, microfinance_loan, savings_account]
        for product in products:
            product.save()

        return {
            "message": "Sample products created successfully",
            "count": len(products)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/all", response_model=dict, tags=["administration"])
async def delete_all_products():
    """Delete all products from the database"""
    try:
        count = Product.objects.count()
        Product.objects.delete()
        return {
            "message": "All products deleted successfully",
            "deleted_count": count
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/extract-from-pdf", response_model=dict, tags=["products"])
async def extract_product_from_pdf(file: UploadFile = File(...)):
    """
    Extract product information from a PDF document.
    
    This endpoint accepts a PDF file (both text-based and scanned) and attempts to
    extract product information. It uses OCR for scanned documents and returns a
    structured representation of the product information with confidence scores.
    
    The response includes only the information that meets the confidence threshold.
    Information that couldn't be confidently extracted will be omitted.
    """
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        # Read the file
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")

        # Extract product information
        extractor = ProductExtractor()
        product_info = extractor.extract_product_info(contents)

        # Add source document information
        product_info["source_document"] = {
            "filename": file.filename,
            "size": len(contents),
            "content_type": file.content_type
        }

        return {
            "message": "Product information extracted successfully",
            "product": product_info
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
