import os
import json
from typing import Dict, Any
import httpx


class LLMExtractor:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        # Allow Dolphin/Ollama/OpenRouter style OpenAI-compatible endpoints
        self.timeout = float(os.getenv("LLM_TIMEOUT", "30"))

    def is_configured(self) -> bool:
        # Some local servers (e.g., Ollama) may not require API keys
        if "ollama" in self.base_url.lower() or "localhost" in self.base_url.lower():
            return True
        return bool(self.api_key)

    async def extract(self, raw_text: str) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("LLM extractor not configured. Set OPENAI_BASE_URL/OPENAI_API_KEY or point to a local OpenAI-compatible server.")

        system = (
            "You extract financial product information from PDF text. "
            "Return strict JSON with keys: name (string), type (one of CreditCard|PersonalLoan|MicrofinanceLoan|SavingsAccount or null), "
            "description (string|null), amount_range ({min,max,currency}|null), tenure_range ({min,max,unit}|null), "
            "interest_rate ({min,max,type}|null), collateral_required (true|false|null), target_segments (string[]|null), "
            "compliance_status (Compliant|PendingReview|ViolationsFound|null). Only JSON in response."
        )
        user = (
            "Extract fields from the following text. If uncertain, return null for the field.\n\nTEXT:\n" + raw_text[:20000]
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
        }

        headers = {"Content-Type": "application/json"}
        # Some servers require Authorization header
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
            try:
                return json.loads(content)
            except Exception:
                # Best-effort fallback: try to extract JSON substring
                start = content.find('{')
                end = content.rfind('}')
                if start != -1 and end != -1 and end > start:
                    return json.loads(content[start:end+1])
                raise ValueError("LLM returned non-JSON output")

    async def extract_market_opportunity(self, context_text: str) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("LLM extractor not configured")

        system = (
            "You generate Market Opportunity JSON ONLY. Schema: {\n"
            "  score:number, market_growth_yoy:number, competition_level:'Low|Medium|High', regulation_level:'Favorable|Unfavorable',\n"
            "  google_search_trends:{ per_keyword:[{keyword:string, yoy_trend:number}], trend_insights?:string },\n"
            "  economic_indicators:{\n"
            "    consumer_confidence_index:{number:number, analytic_percent:number, analytic_string:string},\n"
            "    gdp_growth_rate:{number:number, analytic_percent:number, analytic_string:string},\n"
            "    inflation_rate:{number:number, analytic_percent:number, analytic_string:string}\n"
            "  }\n"
            "}\n"
            "Return valid JSON only. Numbers are floats; use plausible values; if unknown, estimate from context."
        )
        user = "Context for product: \n" + context_text[:20000]

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
        }

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
            return json.loads(content)

    async def extract_market_insights(self, brief_text: str, market_json: Dict[str, Any]) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("LLM extractor not configured")

        system = (
            "You generate Market Insights JSON ONLY, building strictly on the provided Market Opportunity JSON.\n"
            "Schema: { market_opportunity:string, economic_indicators:string, strategic_opportunity:string }\n"
            "Use the earlier values to justify concise insights. Return JSON only."
        )
        user = (
            "PRODUCT BRIEF:\n" + brief_text[:12000] + "\n\n" +
            "MARKET OPPORTUNITY JSON:\n" + json.dumps(market_json, ensure_ascii=False)
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
        }

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
            return json.loads(content)

    async def derive_adjust_imitate(self, current_brief: str, similar: Dict[str, Any]) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("LLM extractor not configured")

        system = (
            "You generate JSON ONLY with two keys: { adjust:string[], imitate:string[] }.\n"
            "Adjust: what the current product should change based on similar product downsides.\n"
            "Imitate: what to copy from similar product upsides. Use 3-5 concise items each."
        )
        user = (
            "CURRENT PRODUCT BRIEF:\n" + current_brief[:10000] + "\n\n" +
            "SIMILAR PRODUCT:\n" + json.dumps(similar, ensure_ascii=False)
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
        }

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
            return json.loads(content)

    async def generate_virtual_persona(self, brief_text: str) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("LLM extractor not configured")

        system = (
            "You generate Virtual Persona JSON ONLY. Schema: {\n"
            "  top_personas: [{ persona:{ name, description, income_range?, area?, lifestyles[], interests[] }, persona_fit_score:number, persona_fit_level:string } x3],\n"
            "  customer_journey_timeline:{ awareness:{date_range,description,touchpoints[],key_metrics[]}, consideration:{...}, purchase:{...}, retention:{...} },\n"
            "  stp_model:{ segmentation:{demographics[],psychographics[],behavioral[],geographic[]}, targeting:{primary,secondary}, positioning:{value_proposition,differentiation,benefits,personality} }\n"
            "}\n"
            "Return valid JSON only."
        )
        user = "PRODUCT BRIEF:\n" + brief_text[:20000]

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
        }

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
            return json.loads(content)

    async def generate_silab_insights(self, market_json: Dict[str, Any], similar_json: Dict[str, Any], vp_json: Dict[str, Any]) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("LLM extractor not configured")

        system = (
            "You generate SiLab Insights JSON ONLY. Schema: {\n"
            "  swot_analysis:{\n"
            "    strengths:{historical_market_fit:string, market_timing:string, persona_adoption:string},\n"
            "    weaknesses:{historical_market_fit:string, market_timing:string, persona_adoption:string},\n"
            "    opportunities:{historical_market_fit:string, market_timing:string, persona_adoption:string},\n"
            "    threats:{historical_market_fit:string, market_timing:string, persona_adoption:string}\n"
            "  },\n"
            "  integrated_insights:{\n"
            "    market_opportunity:{score:number, insight:string},\n"
            "    competitive_position:{score:number, insight:string},\n"
            "    persona_fit:{score:number, insight:string}\n"
            "  },\n"
            "  key_action_points:string[]\n"
            "}\n"
            "Use ALL provided prior sections (market, similar products, virtual persona). Be concise, grounded in the data."
        )
        user = (
            "MARKET OPPORTUNITY JSON:\n" + json.dumps(market_json, ensure_ascii=False) + "\n\n" +
            "SIMILAR PRODUCTS JSON:\n" + json.dumps(similar_json, ensure_ascii=False) + "\n\n" +
            "VIRTUAL PERSONA JSON:\n" + json.dumps(vp_json, ensure_ascii=False)
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
        }

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
            return json.loads(content)


