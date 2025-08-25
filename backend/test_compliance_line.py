#!/usr/bin/env python3
"""
Test line-by-line compliance analysis
"""

import asyncio
import httpx

async def test_line_compliance():
    """Test compliance analysis on a specific problematic line"""
    
    client = httpx.AsyncClient(timeout=30.0)
    base_url = "http://localhost:8001"
    
    # Test a clearly problematic line from the sample document
    problematic_line = "Send money to any mobile number without verification"
    
    # Use the exact prompt format from the HTML UI
    prompt = f"""COMPLIANCE VIOLATION DETECTOR

You are analyzing this specific line from a financial product proposal against Philippine regulations:

LINE TO ANALYZE: "{problematic_line}"

Check this line against these Philippine laws:
1. RA 9160 (Anti-Money Laundering): Requires customer verification, transaction monitoring, suspicious activity reporting
2. RA 10173 (Data Privacy Act): Requires consent for data collection/sharing, secure storage, limited retention  
3. BSP Banking Regulations: Require proper licensing, risk disclosure, consumer protection
4. Securities Regulations: Require proper risk warnings, no guaranteed returns

DOES THIS LINE VIOLATE ANY REGULATIONS?

If YES - respond EXACTLY like this:
VIOLATION_DETECTED: YES
PROBLEMATIC_TEXT: [quote the exact problematic part]
VIOLATION_TYPE: [AML/Data Privacy/Banking/Securities]
SPECIFIC_ISSUE: [explain exactly what's wrong with this statement]
REGULATORY_SOURCE: [cite specific law/regulation violated]

If NO - respond EXACTLY like this:
VIOLATION_DETECTED: NO
REASON: [brief explanation why it's compliant]

Be direct and specific. Focus only on this line."""
    
    try:
        response = await client.post(
            f"{base_url}/r2r/chat",
            json={
                "query": prompt,
                "use_hybrid_search": True
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            completion = result.get('response', {}).get('completion', '')
            
            print(f"🔍 Testing line: '{problematic_line}'")
            print("📋 Compliance Analysis Result:")
            print("-" * 50)
            print(completion)
            print("-" * 50)
            
            # Check if violation was properly detected
            if "VIOLATION_DETECTED: YES" in completion:
                print("✅ VIOLATION CORRECTLY DETECTED!")
            elif "VIOLATION_DETECTED: NO" in completion:
                print("❌ VIOLATION MISSED - This should have been flagged!")
            else:
                print("⚠️  UNCLEAR RESPONSE - Format may be wrong")
                
        else:
            print(f"❌ API Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        
    finally:
        await client.aclose()

if __name__ == "__main__":
    asyncio.run(test_line_compliance())