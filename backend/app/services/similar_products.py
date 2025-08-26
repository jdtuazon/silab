from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


SampleProduct = Dict[str, Any]


def build_sample_similar_products() -> List[SampleProduct]:
    return [
        {
            "product_name": "MetroBank Platinum Card",
            "product_overview": "Premium credit card with airport lounge access, travel insurance, and rewards points.",
            "product_company": "MetroBank",
            "target_audience": "Affluent frequent travelers",
            "market_share": "~12% in premium cards",
            "pricing": "PHP 6,000 annual fee; APR 18.5%",
            "key_features": ["Lounge access", "Travel insurance", "3x rewards on travel"]
        },
        {
            "product_name": "UnionPay Rewards Gold",
            "product_overview": "Mid-tier rewards card focused on everyday cashback with supermarket and fuel perks.",
            "product_company": "UnionPay",
            "target_audience": "Young professionals",
            "market_share": "~8% in mass-affluent segment",
            "pricing": "PHP 2,500 annual fee; APR 18.99%",
            "key_features": ["5% supermarket cashback", "2% fuel cashback", "No foreign transaction fee"]
        },
        {
            "product_name": "RuralBank SME Credit Line",
            "product_overview": "Revolving credit line tailored for SMEs with flexible repayment options.",
            "product_company": "RuralBank PH",
            "target_audience": "Small business owners",
            "market_share": "~5% in SME credit",
            "pricing": "APR 16-20% based on risk",
            "key_features": ["Flexible repayment", "Higher limits with collateral", "Online application"]
        },
        {
            "product_name": "Saver+ High Yield Account",
            "product_overview": "Savings account with tiered interest and app-only bonuses.",
            "product_company": "FinTech Neo",
            "target_audience": "Digital natives",
            "market_share": "~3% in digital savings",
            "pricing": "0 monthly fee; 4.0-5.5% APY tiers",
            "key_features": ["Tiered APY", "App bonuses", "Instant transfers"]
        }
    ]


def _concat_text(product: SampleProduct) -> str:
    parts = [
        product.get("product_name", ""),
        product.get("product_overview", ""),
        product.get("product_company", ""),
        product.get("target_audience", ""),
        product.get("market_share", ""),
        product.get("pricing", ""),
        " ".join(product.get("key_features", [])),
    ]
    return " \n".join([p for p in parts if p])


def rank_similar_products(current_brief_text: str, samples: List[SampleProduct], top_k: int = 3) -> List[Tuple[SampleProduct, float]]:
    corpus = [current_brief_text] + [_concat_text(p) for p in samples]
    vectorizer = TfidfVectorizer(stop_words='english', max_features=4096)
    matrix = vectorizer.fit_transform(corpus)
    query_vec = matrix[0]
    sample_vecs = matrix[1:]
    sims = cosine_similarity(query_vec, sample_vecs).flatten()
    ranked = sorted(zip(samples, sims), key=lambda x: x[1], reverse=True)
    return ranked[:top_k]


