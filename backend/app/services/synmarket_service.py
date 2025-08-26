from typing import Dict, Any
from ..models.schemas import (
    SynMarketRequest,
    SynMarketResponse,
    MarketOpportunitySection,
    VirtualPersonaSection,
    SiLabInsightsSection,
)
from .llm_extractor import LLMExtractor
from .similar_products import build_sample_similar_products, rank_similar_products


async def generate_synmarket(payload: SynMarketRequest) -> SynMarketResponse:
    """Umbrella pipeline for Market Opportunity (with insights) and Similar Products."""
    llm = LLMExtractor()
    if not llm.is_configured():
        raise ValueError("LLM not configured. Set OPENAI_BASE_URL/OPENAI_API_KEY.")

    # Build context
    context_lines = []
    if payload.name:
        context_lines.append(f"Name: {payload.name}")
    if payload.type:
        context_lines.append(f"Type: {payload.type}")
    if payload.compliance_status:
        context_lines.append(f"Compliance: {payload.compliance_status}")
    if payload.tags:
        context_lines.append(f"Tags: {', '.join(payload.tags)}")
    context_lines.append("Brief Text:")
    context_lines.append(payload.brief_text)
    raw_text = "\n".join(context_lines)

    # Market Opportunity
    market_json: Dict[str, Any] = await llm.extract_market_opportunity(raw_text)

    # Insights sequentially based on initial market_json
    insights_json = await llm.extract_market_insights(payload.brief_text, market_json)
    market_json["market_insights"] = insights_json

    # Validate only after insights are merged
    market_section = MarketOpportunitySection(**market_json)

    # Similar Products: TF-IDF cosine + LLM adjust/imitate
    samples = build_sample_similar_products()
    ranked = rank_similar_products(payload.brief_text, samples, top_k=3)
    similarity_items = []
    for sample, sim in ranked:
        ai = await llm.derive_adjust_imitate(payload.brief_text, sample)
        similarity_items.append({
            "similarity_score": float(sim),
            "product_name": sample["product_name"],
            "product_overview": sample["product_overview"],
            "product_company": sample["product_company"],
            "target_audience": sample["target_audience"],
            "market_share": sample.get("market_share"),
            "pricing": sample.get("pricing"),
            "key_features": sample.get("key_features", []),
            "adjust": ai.get("adjust", []),
            "imitate": ai.get("imitate", []),
        })

    combined: Dict[str, Any] = {
        "market_opportunity": market_section.model_dump(),
        "similar_products": {"similarity": similarity_items},
    }

    # Virtual Persona
    vp_json = await llm.generate_virtual_persona(payload.brief_text)
    # Normalize positioning fields to strings if LLM returned lists
    try:
        pos = vp_json.get('stp_model', {}).get('positioning', {})
        for key in ['value_proposition', 'differentiation', 'benefits', 'personality']:
            val = pos.get(key)
            if isinstance(val, list):
                pos[key] = "; ".join(str(x) for x in val)
        # Write back
        if 'stp_model' in vp_json and 'positioning' in vp_json['stp_model']:
            vp_json['stp_model']['positioning'] = pos
    except Exception:
        pass
    vp_section = VirtualPersonaSection(**vp_json)

    # Heuristic persona fit scoring based on brief text keywords
    try:
        brief_lower = payload.brief_text.lower()

        def score_persona(p: dict) -> float:
            # Inputs: persona dict with fields name, lifestyles[], interests[], area
            name = (p.get('persona', {}).get('name') or '').lower()
            area = (p.get('persona', {}).get('area') or '').lower()
            lifestyles = [x.lower() for x in p.get('persona', {}).get('lifestyles', [])]
            interests = [x.lower() for x in p.get('persona', {}).get('interests', [])]

            # Keywords from persona
            tokens = []
            tokens += name.replace('/', ' ').replace('-', ' ').split()
            tokens += area.replace('/', ' ').replace('-', ' ').split()
            for lst in lifestyles:
                tokens += lst.replace('/', ' ').replace('-', ' ').split()
            for it in interests:
                tokens += it.replace('/', ' ').replace('-', ' ').split()

            # Deduplicate and filter short tokens
            tokens = [t for t in {t for t in tokens} if len(t) >= 3]

            if not tokens:
                return 0.0

            matches = sum(1 for t in tokens if t in brief_lower)
            coverage = matches / max(1, len(tokens))

            # Also reward presence of category words
            category_hits = 0
            category_terms = ['student', 'young', 'professional', 'affluent', 'sme', 'business', 'rural', 'urban', 'digital']
            category_hits += sum(1 for c in category_terms if c in brief_lower and c in ' '.join(tokens))

            score = 0.7 * coverage + 0.3 * (min(1.0, category_hits / 3))
            return float(max(0.0, min(1.0, score)))

        def level_for(score: float) -> str:
            if score >= 0.8:
                return 'Excellent'
            if score >= 0.55:
                return 'Strong'
            if score >= 0.3:
                return 'Moderate'
            return 'Weak'

        # Update scores on top_personas
        updated_top = []
        for pf in vp_section.top_personas:
            # Convert to dict to access inner persona easily
            pf_dict = pf.model_dump()
            s = score_persona(pf_dict)
            pf_dict['persona_fit_score'] = s
            pf_dict['persona_fit_level'] = level_for(s)
            updated_top.append(pf_dict)

        from ..models.schemas import PersonaFit
        vp_section.top_personas = [PersonaFit(**x) for x in updated_top]
    except Exception:
        # Non-fatal: keep LLM-provided scores if heuristic fails
        pass
    combined["virtual_persona"] = vp_section.model_dump()

    # SiLab Insights (uses prior sections)
    silab_json = await llm.generate_silab_insights(
        market_section.model_dump(),
        combined["similar_products"],
        vp_section.model_dump(),
    )
    silab_section = SiLabInsightsSection(**silab_json)
    combined["silab_insights"] = silab_section.model_dump()

    return SynMarketResponse(**combined)


