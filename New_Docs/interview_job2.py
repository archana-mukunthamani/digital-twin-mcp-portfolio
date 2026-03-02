#!/usr/bin/env python3
"""
Interview Simulation for Application Support Engineer at Plenti (Job2)
Conducts a full interview conversation using the Digital Twin MCP
"""
import requests
import json
import time

API_URL = "http://localhost:3000/api/mcp"

def query_digital_twin(question: str) -> str:
    """Query the digital twin with a single question"""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "query_digital_twin",
            "arguments": {
                "question": question
            }
        }
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=15)
        result = response.json()
        
        if "result" in result and result["result"] and "content" in result["result"]:
            return result["result"]["content"][0]["text"]
        elif "error" in result:
            return f"ERROR: {result['error'].get('message', 'Unknown error')}"
        else:
            return "ERROR: Unexpected response format"
    except Exception as e:
        return f"ERROR: {str(e)}"

# Interview Questions for Application Support Engineer Role
interview_questions = [
    {
        "num": 1,
        "topic": "Technical Support Experience",
        "question": "Tell me about your experience in application support roles. Have you worked with large engineering teams before, and how do you collaborate with them to resolve complex production issues?"
    },
    {
        "num": 2,
        "topic": "SQL & Database Troubleshooting",
        "question": "This role requires strong SQL skills for data analysis and investigation. Can you describe a specific situation where you used SQL to diagnose and resolve a complex technical issue? What was your approach?"
    },
    {
        "num": 3,
        "topic": "Scripting & Automation",
        "question": "We need someone who can write scripts for automation using Python, Bash, or PowerShell. Can you share examples of automation work you've done? How have your scripts improved operational efficiency?"
    },
    {
        "num": 4,
        "topic": "Troubleshooting & Root Cause Analysis",
        "question": "Walk me through your methodology for investigating complex technical issues. How do you approach log analysis, database queries, and replicating customer environments to identify root causes?"
    },
    {
        "num": 5,
        "topic": "Knowledge Management & Documentation",
        "question": "This role involves creating knowledge base articles, runbooks, and troubleshooting guides. How do you approach documentation? Can you give an example of documentation you've created that improved team scalability?"
    }
]

print("=" * 90)
print("🎯 INTERVIEW SIMULATION: APPLICATION SUPPORT ENGINEER at PLENTI")
print("=" * 90)
print()
print("📋 Position: Application Support Engineer")
print("🏢 Company: Plenti (Fintech)")
print("📍 Location: Sydney, NSW, Australia (Hybrid)")
print()
print("=" * 90)
print()

responses = []

for q in interview_questions:
    print(f"🎤 INTERVIEWER - Question {q['num']}: {q['topic']}")
    print("-" * 90)
    print(f"{q['question']}")
    print()
    
    # Small delay for realism
    time.sleep(0.5)
    
    # Get response from digital twin
    print("💭 Candidate thinking...")
    response = query_digital_twin(q['question'])
    
    print()
    print(f"👤 CANDIDATE (Digital Twin):")
    print("-" * 90)
    print(response)
    print()
    
    responses.append({
        "question_num": q['num'],
        "topic": q['topic'],
        "question": q['question'],
        "response": response
    })
    
    print("=" * 90)
    print()
    time.sleep(1)  # Rate limiting between questions

# Final Assessment
print("\n")
print("=" * 90)
print("📊 INTERVIEWER'S FINAL ASSESSMENT")
print("=" * 90)
print()

assessment_question = """Based on this interview for an Application Support Engineer role at Plenti, 
provide a brief assessment of the candidate's fit. The role requires:
- 3+ years support experience with large engineering teams
- Strong SQL proficiency
- Scripting skills (Python, Bash, PowerShell)  
- Familiarity with .Net/C#
- Experience with log analysis tools
- Excellent troubleshooting and communication skills
- Ability to create documentation and runbooks

Please provide: 
1. Key strengths demonstrated
2. Areas of strong fit
3. Any potential gaps or areas to probe further
4. Overall recommendation (Strong Yes / Yes / Maybe / No)"""

assessment = query_digital_twin(assessment_question)

print("ASSESSMENT:")
print("-" * 90)
print(assessment)
print()
print("=" * 90)
print()

# Summary Statistics
successful_responses = sum(1 for r in responses if "ERROR" not in r['response'])
print(f"✅ Interview completed: {successful_responses}/{len(interview_questions)} questions answered successfully")
print()
print("=" * 90)
