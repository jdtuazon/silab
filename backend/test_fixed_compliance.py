#!/usr/bin/env python3
"""
Test the fixed compliance analysis with proper task prompt
"""

import asyncio
import httpx

async def test_fixed_compliance():
    """Test compliance analysis with structured task prompt"""
    
    client = httpx.AsyncClient(timeout=60.0)
    base_url = "http://localhost:8001"
    
    # Test a clearly problematic line
    problematic_line = "Send money to any mobile number without verification"
    
    # Create a structured task prompt for compliance analysis
    task_prompt = """You are a compliance violation detector for Philippine financial regulations.

INSTRUCTIONS:
1. Analyze the provided line against Philippine laws (RA 9160 AML, RA 10173 Data Privacy, BSP Banking Rules)
2. If violations are found, respond in this EXACT format:
   VIOLATIONS_FOUND: [number]
   
   VIOLATION_TEXT: [quote the problematic text]
   COMPLIANCE_ISSUE: [explain the specific violation]
   REGULATORY_SOURCE: [cite the specific law/regulation]

3. If no violations, respond:
   VIOLATIONS_FOUND: 0
   REASON: [brief explanation why it's compliant]

Be direct and specific. Focus on regulatory violations only."""
    
    try:
        print(f"🔍 Testing line: '{problematic_line}'")
        print("🚀 Using structured task prompt for compliance analysis...")
        
        response = await client.post(
            f"{base_url}/r2r/chat",
            json={
                "query": f'Analyze this line for Philippine regulatory violations: "{problematic_line}"',
                "use_hybrid_search": True,
                "task_prompt": task_prompt
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            completion = result.get('response', {}).get('completion', '')
            
            print("📋 Compliance Analysis Result:")
            print("-" * 70)
            print(completion)
            print("-" * 70)
            
            # Check if structured format is working
            if "VIOLATIONS_FOUND:" in completion:
                print("✅ STRUCTURED FORMAT DETECTED!")
                violations_match = [line for line in completion.split('\n') if 'VIOLATIONS_FOUND:' in line]
                if violations_match:
                    violation_count = violations_match[0].split(':')[1].strip()
                    if violation_count != "0":
                        print(f"✅ VIOLATIONS CORRECTLY DETECTED: {violation_count}")
                    else:
                        print("❌ NO VIOLATIONS DETECTED - This should have been flagged!")
            else:
                print("⚠️  OLD FORMAT DETECTED - Task prompt may not be working")
                
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        
    finally:
        await client.aclose()

if __name__ == "__main__":
    asyncio.run(test_fixed_compliance())