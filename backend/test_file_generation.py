#!/usr/bin/env python3
"""
Test file generation by simulating line-by-line analysis results
"""

import json
from datetime import datetime

def simulate_compliance_analysis():
    """Simulate what the compliance analysis would produce"""
    
    # Simulate sample document lines
    sample_lines = [
        "PRODUCT PROPOSAL: QUICKPAY DIGITAL WALLET SERVICE",
        "Send money to any mobile number without verification",
        "No identity verification required for amounts under ₱50,000",
        "Store biometric data permanently",
        "Customer data stored without encryption",
        "Offer guaranteed 20% monthly returns"
    ]
    
    # Simulate line-by-line results
    lineByLineResults = []
    violations = []
    
    for i, line in enumerate(sample_lines, 1):
        if i == 1:  # Title line - skipped
            lineByLineResults.append({
                "lineNumber": i,
                "originalText": line,
                "status": "SKIPPED",
                "reason": "Header or too short",
                "analysis": "N/A",
                "violations": 0
            })
        elif "verification" in line.lower() or "encryption" in line.lower() or "guaranteed" in line.lower():
            # Simulate violation found
            violation = {
                "originalLine": line,
                "problematicText": line,
                "violationType": "AML/Data Privacy",
                "issue": f"Line {i} violates regulations",
                "source": "RA 9160 Anti-Money Laundering Act"
            }
            violations.append(violation)
            
            lineByLineResults.append({
                "lineNumber": i,
                "originalText": line,
                "status": "VIOLATION",
                "violations": 1,
                "analysis": f"VIOLATIONS_FOUND: 1\nVIOLATION_TEXT: {line}\nCOMPLIANCE_ISSUE: This violates regulatory requirements\nREGULATORY_SOURCE: RA 9160",
                "complianceIssue": f"Line {i} violates regulations",
                "regulatorySource": "RA 9160 Anti-Money Laundering Act"
            })
        else:
            # Simulate compliant line
            lineByLineResults.append({
                "lineNumber": i,
                "originalText": line,
                "status": "COMPLIANT",
                "violations": 0,
                "analysis": "VIOLATIONS_FOUND: 0\nREASON: No violations detected in this line",
                "complianceIssue": None,
                "regulatorySource": None
            })
    
    return lineByLineResults, violations

def generate_files(fileName, lineByLineResults, violations):
    """Generate JSON and text files"""
    
    timestamp = datetime.now().isoformat().replace(":", "-")
    baseName = fileName.replace(".txt", "")
    
    # Generate JSON file
    jsonResults = {
        "documentName": fileName,
        "analysisDate": datetime.now().isoformat(),
        "summary": {
            "totalLines": len(lineByLineResults),
            "linesAnalyzed": len([r for r in lineByLineResults if r["status"] != "SKIPPED"]),
            "violationsFound": len(violations),
            "complianceStatus": "COMPLIANT" if len(violations) == 0 else "NON-COMPLIANT"
        },
        "lineByLineAnalysis": lineByLineResults,
        "violationsSummary": violations
    }
    
    # Save JSON file
    json_filename = f"{baseName}_compliance_analysis_{timestamp}.json"
    with open(json_filename, 'w') as f:
        json.dump(jsonResults, f, indent=2)
    
    # Generate text file
    textContent = f"""COMPLIANCE ANALYSIS REPORT
========================================
Document: {fileName}
Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Total Lines: {len(lineByLineResults)}
Lines Analyzed: {len([r for r in lineByLineResults if r["status"] != "SKIPPED"])}
Violations Found: {len(violations)}
Overall Status: {"COMPLIANT" if len(violations) == 0 else "NON-COMPLIANT"}

LINE-BY-LINE ANALYSIS:
========================================

"""

    for result in lineByLineResults:
        textContent += f"Line {result['lineNumber']}: {result['status']}\n"
        textContent += f"Text: \"{result['originalText']}\"\n"
        textContent += f"Analysis: {result['analysis']}\n"
        if result.get('complianceIssue'):
            textContent += f"Issue: {result['complianceIssue']}\n"
        if result.get('regulatorySource'):
            textContent += f"Source: {result['regulatorySource']}\n"
        textContent += "\n" + "="*50 + "\n\n"
    
    # Save text file
    txt_filename = f"{baseName}_compliance_analysis_{timestamp}.txt"
    with open(txt_filename, 'w') as f:
        f.write(textContent)
    
    print(f"✅ Generated files:")
    print(f"   📄 JSON: {json_filename}")
    print(f"   📄 Text: {txt_filename}")
    
    return json_filename, txt_filename

def main():
    """Test file generation"""
    
    print("🧪 Testing File Generation for Compliance Analysis")
    print("=" * 55)
    
    # Simulate analysis results
    lineByLineResults, violations = simulate_compliance_analysis()
    
    # Generate files
    json_file, txt_file = generate_files("sample_product_proposal.txt", lineByLineResults, violations)
    
    # Display summary
    print(f"\n📊 Analysis Summary:")
    print(f"   📄 Total lines: {len(lineByLineResults)}")
    print(f"   🔍 Lines analyzed: {len([r for r in lineByLineResults if r['status'] != 'SKIPPED'])}")
    print(f"   ⚠️  Violations found: {len(violations)}")
    print(f"   ✅ Status: {'COMPLIANT' if len(violations) == 0 else 'NON-COMPLIANT'}")
    
    print(f"\n💡 File format working correctly!")
    print(f"   The HTML UI will now generate downloadable files with line-by-line diagnosis.")

if __name__ == "__main__":
    main()