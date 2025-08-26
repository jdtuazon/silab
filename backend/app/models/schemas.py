"""
Pydantic models for request/response schemas
"""
from pydantic import BaseModel
from typing import Optional, List, Literal
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


# ==========================
# SynMarket Generator Models
# ==========================

class SynMarketRequest(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    compliance_status: Optional[str] = None
    tags: Optional[List[str]] = None
    brief_text: str


# Market Opportunity
class GoogleSearchTrendItem(BaseModel):
    keyword: str
    yoy_trend: float

class GoogleSearchTrends(BaseModel):
    per_keyword: List[GoogleSearchTrendItem]
    trend_insights: Optional[str] = None

class IndicatorTriple(BaseModel):
    number: float
    analytic_percent: float
    analytic_string: str

class EconomicIndicators(BaseModel):
    consumer_confidence_index: IndicatorTriple
    gdp_growth_rate: IndicatorTriple
    inflation_rate: IndicatorTriple

class MarketInsights(BaseModel):
    market_opportunity: str
    economic_indicators: str
    strategic_opportunity: str

class MarketOpportunitySection(BaseModel):
    score: float
    market_growth_yoy: float
    competition_level: Literal['Low','Medium','High']
    regulation_level: Literal['Favorable','Unfavorable']
    google_search_trends: GoogleSearchTrends
    economic_indicators: EconomicIndicators
    market_insights: MarketInsights


# Similar Products
class SimilarProductItem(BaseModel):
    similarity_score: float
    product_name: str
    product_overview: str
    product_company: str
    target_audience: str
    market_share: Optional[str] = None
    pricing: Optional[str] = None
    key_features: List[str]
    adjust: List[str]
    imitate: List[str]

class SimilarProductsSection(BaseModel):
    similarity: List[SimilarProductItem]


# Virtual Persona
class Persona(BaseModel):
    name: str
    description: str
    income_range: Optional[str] = None
    area: Optional[str] = None
    lifestyles: List[str]
    interests: List[str]

class PersonaFit(BaseModel):
    persona: Persona
    persona_fit_score: float
    persona_fit_level: str

class JourneyStage(BaseModel):
    date_range: str
    description: str
    touchpoints: List[str]
    key_metrics: List[str]

class Segmentation(BaseModel):
    demographics: List[str]
    psychographics: List[str]
    behavioral: List[str]
    geographic: List[str]

class Targeting(BaseModel):
    primary: str
    secondary: str

class Positioning(BaseModel):
    value_proposition: str
    differentiation: str
    benefits: str
    personality: str

class STPModel(BaseModel):
    segmentation: Segmentation
    targeting: Targeting
    positioning: Positioning

class CustomerJourneyTimeline(BaseModel):
    awareness: JourneyStage
    consideration: JourneyStage
    purchase: JourneyStage
    retention: JourneyStage

class VirtualPersonaSection(BaseModel):
    top_personas: List[PersonaFit]
    customer_journey_timeline: CustomerJourneyTimeline
    stp_model: STPModel


# SiLab Insights
class SWOTSub(BaseModel):
    historical_market_fit: Optional[str] = None
    market_timing: Optional[str] = None
    persona_adoption: Optional[str] = None

class SWOTAnalysis(BaseModel):
    strengths: SWOTSub
    weaknesses: SWOTSub
    opportunities: SWOTSub
    threats: SWOTSub

class IntegratedInsightItem(BaseModel):
    score: float
    insight: str

class IntegratedInsights(BaseModel):
    market_opportunity: IntegratedInsightItem
    competitive_position: IntegratedInsightItem
    persona_fit: IntegratedInsightItem

class SiLabInsightsSection(BaseModel):
    swot_analysis: SWOTAnalysis
    integrated_insights: IntegratedInsights
    key_action_points: List[str]


class SynMarketResponse(BaseModel):
    market_opportunity: MarketOpportunitySection
    similar_products: SimilarProductsSection
    virtual_persona: VirtualPersonaSection
    silab_insights: SiLabInsightsSection