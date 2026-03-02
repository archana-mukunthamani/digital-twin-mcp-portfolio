#!/usr/bin/env python3
"""
Simulate a complete interview for job5 (ETL Developer role) using the digital twin
"""

import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from scripts.digital_twin_rag import DigitalTwinRAG

def simulate_interview():
    """Simulate complete interview with Q&A"""
    
    # Initialize RAG system
    print("Initializing Digital Twin for Interview Simulation...\n")
    rag = DigitalTwinRAG()
    
    if not rag.initialize():
        print("\n❌ Failed to initialize RAG system")
        return
    
    print("\n" + "="*80)
    print("INTERVIEW SIMULATION: ETL Developer / Data Analyst at Datalynx")
    print("="*80)
    
    # Role overview from job5.md
    print("\n## 1. INTRODUCTION & ROLE OVERVIEW")
    print("-" * 80)
    print("""
    Position: ETL Developer / Data Analyst
    Company: Datalynx
    Location: Sydney, New South Wales, Australia (Hybrid)
    
    KEY REQUIREMENTS:
    • 6+ years experience in ETL development, data migration, or data integration
    • Strong SQL skills across enterprise database platforms
    • Experience with ETL tools (Informatica, Talend, DataStage, or similar)
    • Understanding of data modeling and relational database concepts
    • Experience with Cloud data platforms (AWS, Azure, Google Cloud) - desirable
    • Exposure to ERP/HCM data migrations (Oracle, SAP, Dynamics) - desirable
    
    Today's interview will assess your technical expertise, problem-solving abilities,
    and fit for this data engineering role at Datalynx.
    """)
    
    # Interview questions
    questions = [
        {
            "num": 1,
            "question": "Tell me about your experience with ETL development and data integration projects. What types of data migration work have you done?"
        },
        {
            "num": 2,
            "question": "Describe your SQL skills and experience working with enterprise database platforms. Can you give me specific examples of complex SQL work you've done?"
        },
        {
            "num": 3,
            "question": "Have you worked with cloud data platforms like AWS, Azure, or Google Cloud? What's your experience with cloud-based data solutions?"
        },
        {
            "num": 4,
            "question": "Can you walk me through a challenging data quality issue you've encountered? How did you identify it and what was your remediation strategy?"
        },
        {
            "num": 5,
            "question": "This role involves working with ERP systems like Oracle, SAP, or Dynamics. Do you have experience with enterprise application data structures or financial data?"
        }
    ]
    
    print("\n## 2. INTERVIEW DIALOGUE")
    print("-" * 80)
    
    # Store responses for assessment
    responses = []
    
    for q in questions:
        print(f"\n**Question {q['num']}**")
        print(f"**Interviewer:** {q['question']}")
        print()
        
        # Query digital twin
        result = rag.rag_query(q['question'], use_llm_formatting=True)
        
        if result['success']:
            response = result['response']
            responses.append({
                'question': q['question'],
                'response': response,
                'results_found': result['results_found']
            })
            
            print(f"**Candidate:** {response}")
            print()
        else:
            print(f"**Candidate:** {result['response']}")
            responses.append({
                'question': q['question'],
                'response': result['response'],
                'results_found': 0
            })
    
    # Interviewer Assessment
    print("\n## 3. INTERVIEWER'S ASSESSMENT & RECOMMENDATION")
    print("-" * 80)
    
    assessment_prompt = f"""Based on the interview responses provided, write a detailed interviewer assessment for an ETL Developer role at Datalynx that requires:
- 6+ years ETL/data integration experience
- Strong SQL and database skills
- Cloud platform experience
- Data quality and migration expertise
- Understanding of ERP data structures

Interview Performance Summary:
{len([r for r in responses if r['results_found'] > 0])} out of {len(questions)} questions received substantive responses

Please provide:
1. STRENGTHS: Key technical strengths demonstrated
2. AREAS OF CONCERN: Gaps or missing qualifications
3. OVERALL FIT: Match to Datalynx requirements
4. RECOMMENDATION: Hire / Needs Follow-up / Not Suitable

Be honest and specific. Reference actual responses from the interview."""
    
    assessment = rag.generate_response(assessment_prompt, model="llama-3.1-8b-instant")
    
    print(assessment)
    
    print("\n" + "="*80)
    print("END OF INTERVIEW SIMULATION")
    print("="*80)


if __name__ == "__main__":
    simulate_interview()
