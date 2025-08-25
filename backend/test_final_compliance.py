#!/usr/bin/env python3
"""
Test the complete fixed compliance analysis system
"""

import asyncio
import httpx

async def test_final_compliance():
    """Test the final compliance analysis system"""
    
    client = httpx.AsyncClient(timeout=60.0)
    base_url = "http://localhost:8001"
    
    # Test multiple problematic lines from the sample document
    test_lines = [
        "Send money to any mobile number without verification",
        "No identity verification required for amounts under ₱50,000",
        "Store biometric data (fingerprints, face recognition) permanently", 
        "Customer data stored on shared cloud servers without encryption",
        "Offer cryptocurrency trading with guaranteed 20% monthly returns"
    ]
    
    task_prompt = """You are analyzing financial service features against Philippine regulations. Based on the retrieved regulatory documents, does the provided text violate any compliance requirements? 

Respond in this exact format:

If violations found:
VIOLATIONS_FOUND: [number]
VIOLATION_TEXT: [quote the problematic text]
COMPLIANCE_ISSUE: [explain the specific violation]
REGULATORY_SOURCE: [cite the specific law/regulation from the documents]

If no violations:
VIOLATIONS_FOUND: 0
REASON: [brief explanation why it's compliant]

Be strict - flag anything that could be problematic based on the regulatory documents."""
    
    print("🧪 Testing Complete Fixed Compliance Analysis System")
    print("=" * 60)
    
    violations_detected = 0
    total_tests = len(test_lines)
    
    for i, line in enumerate(test_lines, 1):
        try:
            print(f"\n🔍 Test {i}/{total_tests}: '{line[:50]}...'")
            
            response = await client.post(
                f"{base_url}/r2r/chat",
                json={
                    "query": line,
                    "use_hybrid_search": True,
                    "task_prompt": task_prompt
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                completion = result.get('response', {}).get('completion', '')
                
                print(f"📋 Analysis Result:")
                print("-" * 40)
                print(completion[:200] + "..." if len(completion) > 200 else completion)
                print("-" * 40)
                
                # Check if violation was detected
                if "VIOLATIONS_FOUND:" in completion:
                    violation_lines = [l for l in completion.split('\n') if 'VIOLATIONS_FOUND:' in l]
                    if violation_lines:
                        violation_count = violation_lines[0].split(':')[1].strip()
                        if violation_count != "0":
                            print(f"✅ VIOLATION DETECTED: {violation_count}")
                            violations_detected += 1
                        else:
                            print("❌ NO VIOLATION DETECTED")
                else:
                    print("⚠️  UNKNOWN FORMAT")
                    
            else:
                print(f"❌ API Error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print(f"\n📊 Final Results:")
    print(f"  🎯 Violations detected: {violations_detected}/{total_tests}")
    print(f"  📈 Detection rate: {(violations_detected/total_tests)*100:.1f}%")
    
    if violations_detected >= 4:  # Expect most/all to be violations
        print("🎉 SYSTEM WORKING CORRECTLY! Violations are being detected!")
    else:
        print("⚠️  System may need further tuning - low detection rate")
    
    await client.aclose()

if __name__ == "__main__":
    asyncio.run(test_final_compliance())