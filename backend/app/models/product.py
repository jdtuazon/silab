from datetime import datetime
from enum import Enum
from typing import List, Optional
from mongoengine import (
    Document,
    StringField,
    FloatField,
    BooleanField,
    DateTimeField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
    EnumField,
    ValidationError,
)

# Enums
class ProductType(str, Enum):
    CREDIT_CARD = "CreditCard"
    PERSONAL_LOAN = "PersonalLoan"
    MICROFINANCE_LOAN = "MicrofinanceLoan"
    SAVINGS_ACCOUNT = "SavingsAccount"

class ComplianceStatus(str, Enum):
    PENDING_REVIEW = "PendingReview"
    COMPLIANT = "Compliant"
    VIOLATIONS_FOUND = "ViolationsFound"

class RewardsType(str, Enum):
    CASHBACK = "Cashback"
    POINTS = "Points"
    MILES = "Miles"
    OTHER = "Other"

class TargetSegment(str, Enum):
    STUDENTS = "Students"
    YOUNG_PROFESSIONALS = "YoungProfessionals"
    FAMILIES = "Families"
    AFFLUENT = "Affluent"
    MASS_MARKET = "MassMarket"

class DistributionChannel(str, Enum):
    BRANCH = "Branch"
    AGENT = "Agent"
    MOBILE_APP = "MobileApp"
    ONLINE = "Online"
    NGO = "NGO"
    COOP = "Coop"

class LoanPurpose(str, Enum):
    EDUCATION = "Education"
    EMERGENCY = "Emergency"
    DEBT_CONSOLIDATION = "DebtConsolidation"
    HOME_IMPROVEMENT = "HomeImprovement"
    OTHER = "Other"

class RepaymentSchedule(str, Enum):
    WEEKLY = "Weekly"
    BI_WEEKLY = "BiWeekly"
    MONTHLY = "Monthly"
    FLEXIBLE = "Flexible"

class TargetDemographics(str, Enum):
    RURAL = "Rural"
    URBAN_POOR = "UrbanPoor"
    WOMEN = "Women"
    INFORMAL_WORKERS = "InformalWorkers"
    FARMERS = "Farmers"

# Embedded Documents for Ranges
class AmountRange(EmbeddedDocument):
    min = FloatField(required=True)
    max = FloatField(required=True)

class TenureRange(EmbeddedDocument):
    min = FloatField(required=True)
    max = FloatField(required=True)

# Product-specific Attribute Documents
class CreditCardAttributes(EmbeddedDocument):
    credit_limit_range = EmbeddedDocumentField(AmountRange, required=True)
    annual_fee = FloatField(required=True)
    interest_rate_apr = FloatField(required=True)
    rewards_type = EnumField(RewardsType, required=True)
    target_segment = ListField(EnumField(TargetSegment), required=True)
    distribution_channel = ListField(EnumField(DistributionChannel), required=True)

class PersonalLoanAttributes(EmbeddedDocument):
    loan_amount_range = EmbeddedDocumentField(AmountRange, required=True)
    interest_rate_apr = FloatField(required=True)
    tenure_range_months = EmbeddedDocumentField(TenureRange, required=True)
    collateral_required = BooleanField(required=True)
    purpose = ListField(EnumField(LoanPurpose), required=True)
    distribution_channel = ListField(
        EnumField(DistributionChannel, 
                 choices=[DistributionChannel.BRANCH, 
                         DistributionChannel.AGENT, 
                         DistributionChannel.MOBILE_APP]), 
        required=True
    )

class MicrofinanceLoanAttributes(EmbeddedDocument):
    loan_amount_range = EmbeddedDocumentField(AmountRange, required=True)
    group_lending = BooleanField(required=True)
    collateral_required = BooleanField(required=True)
    repayment_schedule = EnumField(RepaymentSchedule, required=True)
    distribution_channel = ListField(
        EnumField(DistributionChannel, 
                 choices=[DistributionChannel.AGENT, 
                         DistributionChannel.MOBILE_APP,
                         DistributionChannel.NGO,
                         DistributionChannel.COOP]), 
        required=True
    )
    target_demographics = ListField(EnumField(TargetDemographics), required=True)
    financial_literacy_support = BooleanField(required=True)

class SavingsAccountAttributes(EmbeddedDocument):
    minimum_balance = FloatField()
    interest_rate = FloatField()

# Main Product Document
class Product(Document):
    name = StringField(required=True)
    type = EnumField(ProductType, required=True)
    description = StringField(required=True)
    target_personas = ListField(StringField(), required=True)
    compliance_status = EnumField(ComplianceStatus, required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField()

    # Product-specific attributes based on type
    credit_card_attributes = EmbeddedDocumentField(CreditCardAttributes)
    personal_loan_attributes = EmbeddedDocumentField(PersonalLoanAttributes)
    microfinance_loan_attributes = EmbeddedDocumentField(MicrofinanceLoanAttributes)
    savings_account_attributes = EmbeddedDocumentField(SavingsAccountAttributes)

    def clean(self):
        """Validate that only the correct attributes are set based on product type."""
        attribute_map = {
            ProductType.CREDIT_CARD: ('credit_card_attributes', CreditCardAttributes),
            ProductType.PERSONAL_LOAN: ('personal_loan_attributes', PersonalLoanAttributes),
            ProductType.MICROFINANCE_LOAN: ('microfinance_loan_attributes', MicrofinanceLoanAttributes),
            ProductType.SAVINGS_ACCOUNT: ('savings_account_attributes', SavingsAccountAttributes),
        }

        # Check that only the correct attribute field is set based on type
        for product_type, (field_name, _) in attribute_map.items():
            if self.type == product_type:
                if not getattr(self, field_name):
                    raise ValidationError(f"{field_name} must be set for product type {product_type}")
            else:
                if getattr(self, field_name):
                    raise ValidationError(f"{field_name} should not be set for product type {self.type}")

    def save(self, *args, **kwargs):
        """Update the updated_at timestamp on save."""
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    meta = {
        'collection': 'products',
        'indexes': [
            'type',
            'compliance_status',
            ('type', 'compliance_status'),
            'created_at',
            'updated_at'
        ]
    }
