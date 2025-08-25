from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from ..models.product import (
    Product, ProductType, ComplianceStatus, RewardsType,
    TargetSegment, DistributionChannel, LoanPurpose,
    RepaymentSchedule, TargetDemographics,
    AmountRange, TenureRange,
    CreditCardAttributes, PersonalLoanAttributes,
    MicrofinanceLoanAttributes, SavingsAccountAttributes
)

router = APIRouter(prefix="/products", tags=["products"])

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
    target_personas: List[str] = Field(..., description="Target customer personas")
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

def _map_product_to_response(product: Product) -> dict:
    """Map a Product document to a response dictionary"""
    response = {
        "id": str(product.id),
        "name": product.name,
        "type": product.type,
        "description": product.description,
        "target_personas": product.target_personas,
        "compliance_status": product.compliance_status,
        "created_at": product.created_at,
        "updated_at": product.updated_at,
    }

    # Add type-specific attributes
    if product.type == ProductType.CREDIT_CARD and product.credit_card_attributes:
        response["credit_card_attributes"] = product.credit_card_attributes
    elif product.type == ProductType.PERSONAL_LOAN and product.personal_loan_attributes:
        response["personal_loan_attributes"] = product.personal_loan_attributes
    elif product.type == ProductType.MICROFINANCE_LOAN and product.microfinance_loan_attributes:
        response["microfinance_loan_attributes"] = product.microfinance_loan_attributes
    elif product.type == ProductType.SAVINGS_ACCOUNT and product.savings_account_attributes:
        response["savings_account_attributes"] = product.savings_account_attributes

    return response

@router.post("/", response_model=dict)
async def create_product(product: ProductSchema):
    """Create a new financial product"""
    try:
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
        # Build query filters
        filters = {}
        if type:
            filters["type"] = type
        if compliance_status:
            filters["compliance_status"] = compliance_status

        # Execute query with pagination
        products = Product.objects(**filters).skip(skip).limit(limit)
        return [_map_product_to_response(product) for product in products]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=dict)
async def get_product(product_id: str):
    """Get a specific financial product by ID"""
    try:
        product = Product.objects(id=product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return _map_product_to_response(product)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
