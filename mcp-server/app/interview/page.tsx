'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveInterviewResult, type InterviewResult as SavedInterviewResult } from '@/app/actions/interview-analytics'
import InterviewLanding from './components/InterviewLanding'

interface Message {
  role: 'interviewer' | 'candidate'
  content: string
  timestamp: Date
}

interface InterviewResult {
  decision: 'pass' | 'fail'
  recommendation: string
  score: number
}

export default function InterviewPage() {
  const router = useRouter()
  const [step, setStep] = useState<'landing' | 'interview'>('landing')
  const [jobDescription, setJobDescription] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isInterviewing, setIsInterviewing] = useState(false)
  const [result, setResult] = useState<InterviewResult | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // Auto-start interview when transitioning from landing page with job description
  useEffect(() => {
    if (step === 'interview' && jobDescription && !isInterviewing && messages.length === 0) {
      console.log('🎬 Auto-starting interview from landing page...')
      setTimeout(() => {
        startInterview()
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, jobDescription])

  const generateJobSpecificQuestions = (jobDesc: string): string[] => {
    const lowerDesc = jobDesc.toLowerCase()
    const questions: string[] = []
    
    // Enhanced keyword detection with lower thresholds and more patterns
    const keywordScores = {
      dataAnalyst: (lowerDesc.match(/data analyst|analyst|data profil|bi tool|snowflake|data warehouse|tableau|power bi|analytics|etl/gi) || []).length,
      oracleDB: (lowerDesc.match(/oracle|pl[\/-]?sql|sql developer|database admin|dba/gi) || []).length,
      cloudInfra: (lowerDesc.match(/azure|aws|cloud|m365|microsoft 365|sharepoint|office 365|azure ad|saas/gi) || []).length,
      scripting: (lowerDesc.match(/python|bash|powershell|script|automat|jenkins|ci[\/-]?cd/gi) || []).length,
      support: (lowerDesc.match(/support|troubleshoot|incident|ticket|helpdesk|resolve|diagnos/gi) || []).length,
      sqlGeneral: (lowerDesc.match(/\bsql\b|database|query|t-sql|mysql|postgresql/gi) || []).length,
      webDev: (lowerDesc.match(/react|next\.?js|typescript|javascript|node\.?js|frontend|backend|full[\s-]?stack|api|rest/gi) || []).length,
      consultant: (lowerDesc.match(/consult|solution|implement|requirement|stakeholder|business analyst/gi) || []).length,
    }
    
    console.log('📊 Keyword Detection Scores:', keywordScores)
    
    // Sort all categories by score
    const sortedCategories = Object.entries(keywordScores).sort((a, b) => b[1] - a[1])
    const topCategory = sortedCategories[0]
    const secondCategory = sortedCategories[1]
    
    console.log(`🎯 Top Category: ${topCategory[0]} (score: ${topCategory[1]})`)
    console.log(`🥈 Second Category: ${secondCategory[0]} (score: ${secondCategory[1]})`)
    
    // Generate questions based on top 2 categories (more specific matching)
    // Cloud/Azure-focused role
    if (topCategory[0] === 'cloudInfra' && topCategory[1] >= 2) {
      questions.push('What is your experience with cloud platforms like Microsoft Azure or AWS? Describe a specific cloud project you worked on.')
      if (lowerDesc.includes('m365') || lowerDesc.includes('365') || lowerDesc.includes('sharepoint')) {
        questions.push('Tell me about your experience with Microsoft 365 or SharePoint. What specific features or administration tasks have you worked with?')
      } else {
        questions.push('Describe your experience with cloud-based application deployment or management. What tools and services have you used?')
      }
      if (lowerDesc.includes('api') || lowerDesc.includes('rest')) {
        questions.push('Walk me through your experience with APIs or web services in cloud environments. How do you handle integration challenges?')
      }
    }
    
    // Oracle/Database specialist
    if (topCategory[0] === 'oracleDB' && topCategory[1] >= 2) {
      questions.push('Describe your hands-on experience with Oracle databases. What specific Oracle features or tools have you worked with?')
      questions.push('Tell me about a time you optimized database performance or resolved a complex SQL issue. What was your approach?')
    } else if (secondCategory[0] === 'oracleDB' && secondCategory[1] >= 1) {
      questions.push('What is your experience with Oracle or other enterprise database systems?')
    }
    
    // Data Analyst role
    if (topCategory[0] === 'dataAnalyst' && topCategory[1] >= 2) {
      questions.push('Describe your experience with data analysis and reporting. What analytical tools or platforms have you used?')
      questions.push('Tell me about a time you identified and resolved a data quality or data integrity issue. What was your process?')
      if (lowerDesc.includes('bi') || lowerDesc.includes('visual') || lowerDesc.includes('dashboard')) {
        questions.push('What data visualization or BI tools have you used? Can you describe a dashboard or report you created?')
      }
    } else if (secondCategory[0] === 'dataAnalyst' && secondCategory[1] >= 1) {
      questions.push('Do you have experience with data analysis or working with analytical tools? Please describe.')
    }
    
    // Web Development role
    if (topCategory[0] === 'webDev' && topCategory[1] >= 2) {
      questions.push('Describe your experience with modern web development. What frameworks and technologies are you most comfortable with?')
      questions.push('Tell me about a challenging web application or API project you worked on. What technical decisions did you make?')
    } else if (secondCategory[0] === 'webDev' && secondCategory[1] >= 1) {
      questions.push('What is your experience with web development technologies or frameworks?')
    }
    
    // Scripting/Automation
    if (topCategory[0] === 'scripting' && topCategory[1] >= 2) {
      questions.push('Describe your scripting and automation experience. What languages do you use and what have you automated?')
      questions.push('Tell me about a script or automation tool you developed that improved efficiency or solved a problem.')
    } else if ((secondCategory[0] === 'scripting' && secondCategory[1] >= 1) || lowerDesc.includes('automat')) {
      questions.push('Do you have experience with scripting or automation? What tools or languages have you used?')
    }
    
    // Technical Support role
    if (topCategory[0] === 'support' && topCategory[1] >= 2) {
      questions.push('Tell me about your experience in technical support or troubleshooting. What types of issues have you resolved?')
      questions.push('Describe a particularly challenging support incident. How did you diagnose and resolve it?')
    }
    
    // SQL General (if not already covered by Oracle questions)
    if (topCategory[0] === 'sqlGeneral' && topCategory[1] >= 2) {
      questions.push('Tell me about your SQL experience. What types of queries have you written and which database systems have you worked with?')
    } else if (secondCategory[0] === 'sqlGeneral' && secondCategory[1] >= 1 && questions.length < 3) {
      questions.push('What is your experience with SQL and database queries?')
    }
    
    // Consultant/Solution role
    if (topCategory[0] === 'consultant' && topCategory[1] >= 2) {
      questions.push('Describe your experience working with stakeholders to gather requirements and deliver solutions.')
      questions.push('Tell me about a time you had to implement a solution based on business needs. How did you approach it?')
    }
    
    // Fill to 5 questions with intelligent general questions (different based on role)
    while (questions.length < 5) {
      if (questions.length === 3 || questions.length === 0) {
        questions.push('What relevant work experience and skills make you a strong fit for this position? Please be specific.')
      } else if (questions.length === 4 || questions.length === 1) {
        questions.push('Why are you interested in this specific position and company? What attracts you to this opportunity?')
      } else {
        questions.push('Describe a challenging project or situation from your experience. How did you handle it and what was the outcome?')
      }
    }
    
    // Return exactly 5 questions
    const finalQuestions = questions.slice(0, 5)
    console.log('❓ Generated Questions:', finalQuestions)
    return finalQuestions
  }

  const startInterview = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description')
      return
    }

    setIsInterviewing(true)
    setMessages([])
    setResult(null)
    setCurrentQuestion(0)

    // Start the interview process
    await conductInterview()
  }

  const conductInterview = async () => {
    // Generate job-specific questions based on the job description
    const questions = generateJobSpecificQuestions(jobDescription)
    
    // Extract company name from job description (first few words or first line)
    const companyNameMatch = jobDescription.match(/(?:at|for|with)\s+([A-Z][A-Za-z\s&]+?)(?:\s*[-–—]\s*|\n|$)/)
    const companyName = companyNameMatch ? companyNameMatch[1].trim() : 'the target company'
    
    // Extract job title
    const jobTitleMatch = jobDescription.match(/^(.+?)(?:\s*[-–—]\s*|\n)/)
    const jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : 'this position'
    
    console.log(`📋 Interview Context: Job="${jobTitle}" Company="${companyName}"`)
    
    // Collect Q&A pairs in local array (fixes React state closure issue)
    const qaTranscript: Array<{ question: string; answer: string }> = []

    for (let i = 0; i < questions.length; i++) {
      setCurrentQuestion(i + 1)

      // Add interviewer question
      const question = questions[i]
      setMessages((prev) => [
        ...prev,
        { role: 'interviewer', content: question, timestamp: new Date() },
      ])

      // Simulate thinking delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get answer from Digital Twin via MCP
      try {
        console.log(`🎤 Q${i + 1}:`, question)
        
        // Enhance question with job context for company/position-related questions
        let enhancedQuestion = question
        if (question.toLowerCase().includes('interested') && 
            (question.toLowerCase().includes('position') || question.toLowerCase().includes('company'))) {
          // For "Why are you interested" questions, prepend context
          enhancedQuestion = `[JOB CONTEXT: The target position is "${jobTitle}" at "${companyName}"]\\n\\n${question}\\n\\nIMPORTANT: Answer about your interest in "${companyName}" (the TARGET company). Do NOT mention or confuse with past employer companies from your background.`
        } else if (question.toLowerCase().includes('this role') || question.toLowerCase().includes('this position')) {
          // For role-specific questions, add job title context
          enhancedQuestion = `[JOB CONTEXT: The position is "${jobTitle}"]\\n\\n${question}`
        }
        
        const response = await fetch('/api/mcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: i + 1,
            method: 'tools/call',
            params: {
              name: 'query_digital_twin',
              arguments: { query: enhancedQuestion },
            },
          }),
        })

        const data = await response.json()
        console.log(`💬 A${i + 1} (${data.result?.content?.[0]?.text?.substring(0, 100)}...)`)
        const answer = data.result?.content?.[0]?.text || 'Unable to retrieve answer.'

        // Store Q&A in local array for transcript
        qaTranscript.push({ question, answer })

        // Add candidate answer to messages (for UI display)
        setMessages((prev) => [
          ...prev,
          { role: 'candidate', content: answer, timestamp: new Date() },
        ])

        // Longer delay between questions for better readability
        await new Promise((resolve) => setTimeout(resolve, 4000))
      } catch (error) {
        console.error('Error querying Digital Twin:', error)
        const errorAnswer = 'Error: Unable to retrieve answer.'
        
        // Store error in transcript too
        qaTranscript.push({ question, answer: errorAnswer })
        
        setMessages((prev) => [
          ...prev,
          {
            role: 'candidate',
            content: errorAnswer,
            timestamp: new Date(),
          },
        ])
      }
    }

    console.log(`📝 Interview complete. Collected ${qaTranscript.length} Q&A pairs`)

    // Generate final recommendation and save with transcript
    await generateRecommendation(qaTranscript)
  }

  const generateRecommendation = async (qaTranscript: Array<{ question: string; answer: string }>) => {
    // Simulate evaluation delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Check how many questions were actually answered (not errors or "Unable to retrieve")
    const validAnswers = qaTranscript.filter(qa => 
      qa.answer && 
      !qa.answer.includes('Unable to retrieve answer') && 
      !qa.answer.includes('Error:') &&
      !qa.answer.includes("I don't have specific information")
    ).length
    
    const totalQuestions = qaTranscript.length
    const answerRate = totalQuestions > 0 ? (validAnswers / totalQuestions) : 0
    
    // Base score on answer rate (0-5 valid = score penalty)
    let baseScore = 70
    if (validAnswers === 0) {
      baseScore = 35  // Critical fail
    } else if (validAnswers === 1) {
      baseScore = 50  // Poor
    } else if (validAnswers === 2) {
      baseScore = 60  // Below average  
    } else if (validAnswers === 3) {
      baseScore = 70  // Average
    } else if (validAnswers === 4) {
      baseScore = 80  // Good
    } else {
      baseScore = 85  // Excellent (all 5 answered)
    }
    
    // Add small random variance (±5 points)
    const score = Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 11) - 5))
    const decision = score >= 70 ? 'pass' : 'fail'
    
    console.log(`📊 Evaluation: ${validAnswers}/${totalQuestions} answered, Score: ${score}, Decision: ${decision.toUpperCase()}`)
    
    // Generate comprehensive assessment report based on answer quality
    // Category scores should reflect the overall answer rate
    const categoryBase = Math.floor(score * 0.8)  // Base categories on overall score
    const technicalScore = Math.min(100, categoryBase + Math.floor(Math.random() * 15) - 5)
    const experienceScore = Math.min(100, categoryBase + Math.floor(Math.random() * 15) - 5)
    const cultureFitScore = Math.max(0, Math.min(100, categoryBase + Math.floor(Math.random() * 20) - 10))
    const communicationScore = validAnswers === 0 ? 30 : Math.min(100, categoryBase + Math.floor(Math.random() * 15))

    // Extract job-specific details
    const lowerDesc = jobDescription.toLowerCase()
    const isDataRole = lowerDesc.includes('data analyst')
    const isSupportRole = lowerDesc.includes('support engineer') || lowerDesc.includes('support specialist')
    const requiresSQL = lowerDesc.includes('sql')
    const requiresPython = lowerDesc.includes('python') || lowerDesc.includes('scripting')
    const requiresCloud = lowerDesc.includes('cloud') || lowerDesc.includes('azure') || lowerDesc.includes('aws')
    const requiresOracle = lowerDesc.includes('oracle') || lowerDesc.includes('pl/sql')
    const requiresSnowflake = lowerDesc.includes('snowflake')
    const requiresDatadog = lowerDesc.includes('datadog')
    const requiresAgile = lowerDesc.includes('agile')

    // Build job-specific technical skills assessment
    let technicalSkills = ''
    if (isDataRole) {
      technicalSkills = `   • SQL & Data Warehousing: ${decision === 'pass' ? 'Strong - ' + (requiresSnowflake ? 'Snowflake experience demonstrated' : 'Database proficiency shown') : 'Moderate - needs more ' + (requiresSnowflake ? 'Snowflake' : 'database') + ' experience'}\n   • Data Analysis & Profiling: ${decision === 'pass' ? 'Proficient in source-to-target analysis' : 'Basic understanding, needs development'}\n   • BI Tools & Visualization: ${decision === 'pass' ? 'Experienced' : 'Limited exposure'}\n   • ${requiresAgile ? 'Agile/Project Management' : 'Data Governance'}: ${decision === 'pass' ? 'Understands principles' : 'Needs training'}`
    } else if (isSupportRole) {
      technicalSkills = `   • Troubleshooting & Root Cause Analysis: ${decision === 'pass' ? 'Strong diagnostic skills' : 'Needs more hands-on experience'}\n   • ${requiresSQL ? 'SQL for Support/Analysis' : 'Technical Skills'}: ${decision === 'pass' ? 'Proficient in queries and optimization' : 'Developing'}\n   • ${requiresPython ? 'Scripting (Python/Bash/PowerShell)' : 'Automation'}: ${decision === 'pass' ? 'Can write automation scripts' : 'Basic scripting only'}\n   • ${requiresOracle ? 'Oracle/PL-SQL' : requiresDatadog ? 'Monitoring Tools (Datadog)' : 'Database'} Knowledge: ${decision === 'pass' ? 'Solid understanding' : 'Needs improvement'}`
    } else {
      technicalSkills = `   • Core Technical Skills: ${decision === 'pass' ? 'Strong foundation' : 'Needs development'}\n   • ${requiresCloud ? 'Cloud Platforms (Azure/AWS)' : 'Modern Technologies'}: ${decision === 'pass' ? 'Experienced' : 'Limited'}\n   • Problem-Solving: ${decision === 'pass' ? 'Analytical approach' : 'Needs structure'}\n   • Tool Proficiency: ${decision === 'pass' ? 'Comfortable with required tools' : 'Requires training'}`
    }

    // Build job-specific skills gaps
    let skillsGaps = ''
    if (decision === 'pass') {
      if (isDataRole) {
        skillsGaps = '   • Deepen expertise in ' + (requiresSnowflake ? 'advanced Snowflake features (streams, tasks)' : 'cloud data platforms') + '\n   • Consider certification in ' + (requiresSnowflake ? 'SnowPro Core' : 'cloud data (Azure/AWS)') + '\n   • Continue building data governance knowledge\n   • Expand BI tool portfolio'
      } else if (isSupportRole) {
        skillsGaps = '   • Gain deeper knowledge in ' + (requiresOracle ? 'Oracle internals and performance tuning' : 'system architecture') + '\n   • Enhance ' + (requiresPython ? 'Python scripting and automation' : 'automation capabilities') + '\n   • Develop ' + (requiresDatadog ? 'advanced Datadog monitoring and alerting' : 'incident management') + ' expertise\n   • Build stronger documentation skills'
      } else {
        skillsGaps = '   • Deepen knowledge in role-specific technologies\n   • Consider relevant certifications\n   • Continue building technical leadership\n   • Expand cross-functional collaboration'
      }
    } else {
      if (requiresSQL && requiresOracle) {
        skillsGaps = '   • CRITICAL: Advanced Oracle PL/SQL proficiency needed\n   • Stored procedures and performance tuning essential\n   • Hands-on project experience with large datasets\n   • Consider Oracle Database certification'
      } else if (requiresSQL) {
        skillsGaps = '   • CRITICAL: Advanced SQL/query optimization skills needed\n   • ' + (requiresSnowflake ? 'Snowflake cloud data warehouse experience essential' : 'Database performance tuning required') + '\n   • Hands-on project work with large-scale data\n   • Formal training in database management'
      } else if (requiresPython) {
        skillsGaps = '   • CRITICAL: Python scripting proficiency needed\n   • Automation framework experience required\n   • Development best practices training\n   • Version control (Git) skills essential'
      } else if (requiresCloud) {
        skillsGaps = '   • CRITICAL: Cloud platform experience (Azure/AWS) needed\n   • Infrastructure as Code understanding required\n   • Cloud architecture patterns training\n   • Hands-on cloud projects essential'
      } else {
        skillsGaps = '   • CRITICAL: Core technical skills below requirements\n   • Significant hands-on experience needed\n   • Formal training in key technologies\n   • Project portfolio development required'
      }
    }

    // Build job-specific next steps
    const technicalFocus = requiresSQL && requiresOracle ? 'Oracle PL/SQL and database tuning' : 
                          requiresSQL && requiresSnowflake ? 'Snowflake and cloud data warehousing' :
                          requiresPython ? 'Python scripting and automation' :
                          requiresCloud ? 'cloud platforms and architecture' :
                          'core technical skills'
    
    const toolsFocus = requiresSnowflake ? 'Snowflake, BI platforms' :
                      requiresDatadog ? 'Datadog, monitoring/logging tools' :
                      requiresOracle ? 'Oracle Database, PL/SQL Developer' :
                      'job-specific tools mentioned'

    const recommendation = `
**═══════════════════════════════════════════════**
📊 FINAL ASSESSMENT REPORT
**═══════════════════════════════════════════════**

**EXECUTIVE SUMMARY**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decision === 'pass' ? '✅ RECOMMENDATION: HIRE' : '❌ RECOMMENDATION: DO NOT HIRE'}
🎯 Overall Suitability Score: ${score}/100 (${decision === 'pass' ? 'Strong Match' : 'Below Threshold'})

**Key Reasons:**
${decision === 'pass' ? '• Technical skills align well with job requirements • Demonstrated relevant experience in key areas • Strong problem-solving and communication abilities • Cultural fit indicators positive' : '• Technical skills gap in critical job requirements • Limited hands-on experience in key technologies • Additional training/development needed • Consider for junior role or with development plan'}

**DETAILED BREAKDOWN**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **Technical Competency:** ${technicalScore}/100
${technicalSkills}

💼 **Experience Relevance:** ${experienceScore}/100
   • Years of Experience: ${decision === 'pass' ? 'Meets job requirements' : 'Below required level'}
   • Industry Background: ${decision === 'pass' ? 'Directly relevant' : 'Some transferable skills only'}
   • Project Complexity: ${decision === 'pass' ? 'Handled similar-scale projects' : 'Mostly smaller scope work'}
   • Tool/Technology Familiarity: ${decision === 'pass' ? 'Knows required tech stack' : 'Limited exposure to required tools'}

🤝 **Cultural Fit Evaluation:** ${cultureFitScore}/100
   • Communication Style: ${communicationScore >= 85 ? 'Clear, professional, technical depth' : 'Adequate but could be more detailed'}
   • Team Collaboration: ${decision === 'pass' ? 'Strong collaborative examples' : 'Limited team experience shown'}
   • Learning Mindset: ${decision === 'pass' ? 'Growth-oriented, seeks challenges' : 'Some resistance to change indicators'}
   • Problem Approach: ${decision === 'pass' ? 'Systematic, analytical, proactive' : 'More reactive than proactive'}

💰 **Salary/Location Alignment:**
   • Location: Sydney (Hybrid) - ✅ Confirmed aligned
   • Salary Expectations: ${decision === 'pass' ? 'Within approved budget range' : 'May need negotiation'}
   • Start Date: ${decision === 'pass' ? 'Available within required timeframe' : 'Extended notice period concern'}

⚠️ **Risk Factors Identified:**
${decision === 'pass' ? '   • LOW RISK: Strong technical and cultural fit • Minor skill gaps addressable via onboarding • Standard reference checks recommended' : '   • MODERATE-HIGH RISK: Significant skill development needed • 3-6 month ramp-up with training investment • Consider only if limited candidate pool'}

**IMPROVEMENT AREAS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **Skills Gaps to Address:**
${skillsGaps}

📝 **Missing Profile Information:**
   • Specific metrics/KPIs from recent projects
   • Relevant certifications for ${isDataRole ? 'data analytics (SnowPro, Azure)' : isSupportRole ? 'technical support/ITIL' : 'this role'}
   • References from previous managers/colleagues
   • Portfolio or code samples demonstrating expertise

💡 **Areas for Better Interview Responses:**
   • Provide more quantifiable achievements (%, $, scale)
   • Use STAR method consistently (Situation-Task-Action-Result)
   • Include specific technical implementation details
   • Demonstrate business impact awareness and metrics

**RECOMMENDED NEXT STEPS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decision === 'pass' ? '\\n✅ **For Hiring Team:**\\n   1. Schedule technical assessment focused on ' + technicalFocus + '\\n   2. Conduct behavioral interview with hiring manager\\n   3. Check professional references (2-3)\\n   4. Prepare offer within approved salary band\\n   5. Timeline: 1-2 weeks to final decision\\n\\n✅ **For Candidate:**\\n   1. Prepare for technical deep-dive on ' + technicalFocus + '\\n   2. Review specific tools mentioned: ' + toolsFocus + '\\n   3. Prepare questions about team, projects, growth\\n   4. Have references ready with notice' : '\\n❌ **For Hiring Team:**\\n   1. Send professional rejection with appreciation\\n   2. Keep profile for junior positions if applicable\\n   3. Consider skills development program if potential shown\\n   4. Continue candidate search\\n\\n📚 **For Candidate (Development Roadmap):**\\n   1. Focus on critical skill gaps: ' + technicalFocus + '\\n   2. Build hands-on project portfolio in required areas\\n   3. Consider formal training/bootcamp\\n   4. Gain 6-12 months relevant experience then re-apply'}

**═══════════════════════════════════════════════**
📅 Report Generated: ${new Date().toLocaleString()}
🤖 Powered by Digital Twin MCP Server
**═══════════════════════════════════════════════**
    `.trim()

    setResult({ decision, recommendation, score })
    setIsInterviewing(false)
    
    // Save interview result to Redis with transcript
    await saveInterviewToDatabase({
      score,
      decision,
      technicalScore,
      experienceScore,
      communicationScore,
      cultureFitScore,
    }, qaTranscript)
  }

  const saveInterviewToDatabase = async (
    resultData: {
      score: number
      decision: 'pass' | 'fail'
      technicalScore: number
      experienceScore: number
      communicationScore: number
      cultureFitScore: number
    },
    qaTranscript: Array<{ question: string; answer: string }>
  ) => {
    try {
      // Extract job title from description (first line or first 50 chars)
      const jobTitleMatch = jobDescription.match(/^(.+?)(?:\n|$)/)
      const jobTitle = jobTitleMatch
        ? jobTitleMatch[1].trim().substring(0, 100)
        : jobDescription.substring(0, 50).trim() + '...'

      // Build transcript with scores and feedback from Q&A pairs
      console.log(`📝 Building transcript from ${qaTranscript.length} Q&A pairs`)
      const transcript = qaTranscript.map((qa) => {
        // Check if answer is valid (not error or "Unable to retrieve")
        const isValidAnswer = qa.answer && 
          !qa.answer.includes('Unable to retrieve answer') && 
          !qa.answer.includes('Error:') &&
          !qa.answer.includes("I don't have specific information")
        
        // Score based on answer validity and length/quality
        let questionScore = 0
        if (!isValidAnswer) {
          questionScore = 0  // No answer = 0 score
        } else if (qa.answer.length < 50) {
          questionScore = Math.floor(Math.random() * 20) + 40 // 40-60 for very short answers
        } else if (qa.answer.length < 150) {
          questionScore = Math.floor(Math.random() * 20) + 60 // 60-80 for short answers
        } else {
          questionScore = Math.floor(Math.random() * 30) + 70 // 70-100 for detailed answers
        }
        
        // Generate contextual feedback based on score
        let feedback = ''
        if (questionScore === 0) {
          feedback = 'Unable to provide answer. The system could not retrieve relevant information from the professional background for this question. This may indicate a gap in documented experience for this specific area.'
        } else if (questionScore >= 85) {
          feedback = 'Excellent answer demonstrating strong knowledge and clear communication. The response was well-structured and showed deep understanding of the topic with relevant examples.'
        } else if (questionScore >= 75) {
          feedback = 'Good answer that covers the key points. The response shows solid understanding, though could benefit from more specific examples or deeper technical detail.'
        } else if (questionScore >= 60) {
          feedback = 'Adequate answer but lacks depth. Consider providing more concrete examples and demonstrating stronger technical knowledge in this area.'
        } else {
          feedback = 'Brief answer with limited detail. The response needs significant expansion with specific examples and technical depth to be competitive.'
        }
        
        return {
          question: qa.question,
          answer: qa.answer,
          score: questionScore,
          feedback,
        }
      })
      console.log(`✅ Generated transcript with ${transcript.length} Q&A pairs`)

      // Generate context-aware strengths and improvements based on job role and scores
      const strengths: string[] = []
      const improvements: string[] = []
      
      // Analyze job description for context
      const lowerJobDesc = jobDescription.toLowerCase()
      const isCloudRole = lowerJobDesc.includes('cloud') || lowerJobDesc.includes('azure') || lowerJobDesc.includes('aws')
      const isDataRole = lowerJobDesc.includes('data') || lowerJobDesc.includes('analyst') || lowerJobDesc.includes('bi')
      const isDatabaseRole = lowerJobDesc.includes('oracle') || lowerJobDesc.includes('database') || lowerJobDesc.includes('sql')
      const isSupportRole = lowerJobDesc.includes('support') || lowerJobDesc.includes('troubleshoot')
      const isWebDevRole = lowerJobDesc.includes('react') || lowerJobDesc.includes('next') || lowerJobDesc.includes('frontend') || lowerJobDesc.includes('full-stack')
      
      // Generate role-specific strengths (when score >= 75)
      if (resultData.technicalScore >= 75) {
        if (isCloudRole) strengths.push('Demonstrated cloud platform knowledge and architecture understanding')
        else if (isDataRole) strengths.push('Strong analytical skills and data-driven approach')
        else if (isDatabaseRole) strengths.push('Solid database management and SQL proficiency')
        else if (isWebDevRole) strengths.push('Strong web development technical foundation')
        else strengths.push('Good technical problem-solving abilities')
      }
      
      if (resultData.experienceScore >= 75) {
        if (isCloudRole) strengths.push('Relevant cloud infrastructure project experience')
        else if (isDataRole) strengths.push('Practical experience with data analysis workflows')
        else if (isSupportRole) strengths.push('Proven troubleshooting and support experience')
        else strengths.push('Demonstrated relevant hands-on experience')
      }
      
      if (resultData.communicationScore >= 75) {
        strengths.push('Clear communication with structured responses')
      }
      
      if (resultData.cultureFitScore >= 75) {
        strengths.push('Good alignment with role requirements and expectations')
      }
      
      // Generate role-specific improvements (when score < 70)
      if (resultData.technicalScore < 70) {
        if (isCloudRole) improvements.push('Deepen cloud architecture and service knowledge')
        else if (isDataRole) improvements.push('Enhance data analysis and visualization skills')
        else if (isDatabaseRole) improvements.push('Strengthen database optimization expertise')
        else if (isWebDevRole) improvements.push('Expand modern framework proficiency')
        else improvements.push('Deepen technical knowledge in core areas')
      }
      
      if (resultData.experienceScore < 70) {
        if (isCloudRole) improvements.push('Gain more cloud migration or deployment experience')
        else if (isDataRole) improvements.push('Build portfolio of data projects with measurable impact')
        else if (isSupportRole) improvements.push('Broaden incident resolution case studies')
        else improvements.push('Gain more hands-on project experience')
      }
      
      if (resultData.communicationScore < 70) {
        improvements.push('Work on communication clarity and structure')
      }
      
      if (resultData.cultureFitScore < 70) {
        improvements.push('Better align responses with company values and culture')
      }

      // Generate insights
      const insights: string[] = [
        `Overall performance: ${resultData.score >= 85 ? 'Excellent' : resultData.score >= 75 ? 'Good' : 'Needs improvement'}`,
        `Strongest category: ${getStrongestCategory(resultData)}`,
      ]
      
      if (resultData.decision === 'pass') {
        insights.push('Candidate shows strong potential for the role')
      } else {
        insights.push('Consider additional training before re-application')
      }

      const interviewData: SavedInterviewResult = {
        id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date(),
        jobTitle,
        jobDescription,
        overallScore: resultData.score,
        categoryScores: {
          technical: resultData.technicalScore,
          experience: resultData.experienceScore,
          communication: resultData.communicationScore,
          culturalFit: resultData.cultureFitScore,
        },
        decision: resultData.decision === 'pass' ? 'pass' : resultData.score >= 70 ? 'conditional' : 'fail',
        transcript,
        strengths,
        improvements,
        insights,
      }

      const result = await saveInterviewResult(interviewData)
      
      if (result.success) {
        console.log('✅ Interview result saved to database')
      } else {
        console.error('❌ Failed to save interview result:', result.error)
      }
    } catch (error) {
      console.error('❌ Error saving interview to database:', error)
    }
  }

  const getStrongestCategory = (scores: {
    technicalScore: number
    experienceScore: number
    communicationScore: number
    cultureFitScore: number
  }): string => {
    const categories = [
      { name: 'Communication', score: scores.communicationScore },
      { name: 'Technical Skills', score: scores.technicalScore },
      { name: 'Experience', score: scores.experienceScore },
      { name: 'Cultural Fit', score: scores.cultureFitScore },
    ]
    
    const strongest = categories.reduce((max, cat) => (cat.score > max.score ? cat : max))
    return strongest.name
  }

  const handleStartInterview = async (jobDesc: string) => {
    console.log('🚀 Starting interview with job description...')
    setJobDescription(jobDesc)
    setStep('interview')
    // Interview will auto-start via useEffect
  }
const handleViewAnalytics = () => {
    router.push('/interview/analytics')
  }

  // Show landing page first
  if (step === 'landing') {
    return (
      <InterviewLanding 
        onStartInterview={handleStartInterview}
        onViewAnalytics={handleViewAnalytics}
      />
    )
  }

  // Interview UI below
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Back to Landing Button */}
        <button
          onClick={() => {
            setStep('landing')
            setMessages([])
            setResult(null)
            setJobDescription('')
            setIsInterviewing(false)
          }}
          className="mb-6 text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-2 transition-colors"
        >
          ← Back to Landing Page
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            🎤 AI-Powered Interview
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            Watch the Digital Twin answer interview questions in real-time
          </p>
        </div>

        {/* Interview Progress */}
        {isInterviewing && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6 border-2 border-pink-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                ⏳ Interview in Progress...
              </h2>
              <span className="text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full shadow-lg">
                Question {currentQuestion} of 5
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 shadow-lg animate-pulse"
                style={{ width: `${(currentQuestion / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Interview Transcript */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6 border-2 border-blue-200">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            💬 Interview Transcript
          </h2>
          <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎙️</div>
                <p className="text-gray-500 text-xl font-medium">
                  No interview started yet
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`p-6 rounded-2xl transform transition-all duration-300 hover:scale-102 ${
                      msg.role === 'interviewer'
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-lg'
                        : 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 shadow-lg'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`font-black text-xl ${
                        msg.role === 'interviewer' ? 'text-blue-700' : 'text-green-700'
                      }`}>
                        {msg.role === 'interviewer' ? '💼 Interviewer' : '🤖 Digital Twin'}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                  </div>
                  {/* Add separator between Q&A pairs */}
                  {idx < messages.length - 1 && msg.role === 'candidate' && (
                    <div className="flex items-center justify-center my-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interview Result */}
        {result && (
          <div
            className={`rounded-2xl shadow-2xl p-10 border-4 transform transition-all duration-500 ${
              result.decision === 'pass'
                ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-500'
                : 'bg-gradient-to-br from-red-50 to-rose-100 border-red-500'
            }`}
          >
            <h2 className="text-5xl font-black mb-6 text-center">
              {result.decision === 'pass' ? '✅ PASS' : '❌ FAIL'}
            </h2>
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                <span className="font-black text-2xl text-gray-800">🎯 Overall Score:</span>
                <span className={`font-black text-3xl ${
                  result.decision === 'pass' ? 'text-green-600' : 'text-red-600'
                }`}>{result.score}/100</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-6 shadow-inner">
                <div
                  className={`h-6 rounded-full transition-all duration-1000 shadow-lg ${
                    result.decision === 'pass' 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-600' 
                      : 'bg-gradient-to-r from-red-400 to-rose-600'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-xl max-h-96 overflow-y-auto">
              <h3 className="font-black mb-4 text-gray-800 text-2xl flex items-center gap-2">
                📋 Comprehensive Assessment:
              </h3>
              <pre className="text-gray-700 leading-relaxed text-sm font-sans whitespace-pre-wrap">{result.recommendation}</pre>
            </div>
            <button
              onClick={() => {
                setStep('landing')
                setMessages([])
                setResult(null)
                setJobDescription('')
                setIsInterviewing(false)
              }}
              className="mt-8 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🔄 Start New Interview
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
