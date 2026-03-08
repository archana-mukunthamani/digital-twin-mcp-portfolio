'use server'

import { redis } from '@/lib/redis'

// Debug: Log environment variables on module load
console.log('🔍 Redis Config Check:', {
  url: process.env.UPSTASH_REDIS_REST_URL ? 'SET ✅' : 'MISSING ❌',
  token: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET ✅' : 'MISSING ❌',
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InterviewResult {
  id: string
  date: Date
  jobTitle: string
  jobDescription: string
  overallScore: number
  categoryScores: {
    technical: number
    experience: number
    communication: number
    culturalFit: number
  }
  decision: 'pass' | 'conditional' | 'fail'
  transcript: Array<{
    question: string
    answer: string
    score: number
    feedback: string
  }>
  strengths: string[]
  improvements: string[]
  insights: string[]
}

export interface AnalyticsSummary {
  totalInterviews: number
  averageScore: number
  categoryAverages: {
    technical: number
    experience: number
    communication: number
    culturalFit: number
  }
  passRate: number
  recentInterviews: Array<{
    id: string
    date: Date
    jobTitle: string
    overallScore: number
    decision: 'pass' | 'conditional' | 'fail'
  }>
  performanceTrend: Array<{
    date: string
    overall: number
    technical: number
    experience: number
    communication: number
    culturalFit: number
  }>
  insights: string[]
  commonStrengths: Array<{ label: string; count: number }>
  commonImprovements: Array<{ label: string; count: number }>
}

// ─── Save Interview Result ────────────────────────────────────────────────────

export async function saveInterviewResult(result: InterviewResult): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('💾 Attempting to save interview:', result.id)
    
    const key = `interview:${result.id}`
    
    // Save full interview data (Upstash SDK handles JSON serialization automatically)
    await redis.set(key, result)
    console.log('✅ Saved to Redis key:', key)
    
    // Add to interviews list (for chronological retrieval)
    await redis.zadd('interviews:list', {
      score: new Date(result.date).getTime(),
      member: result.id,
    })
    console.log('✅ Added to interviews list')
    
    // Set expiration to 1 year (optional)
    await redis.expire(key, 31536000)
    
    console.log('✅ Interview saved successfully!')
    return { success: true }
  } catch (error) {
    console.error('❌ Failed to save interview result:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ─── Get Interview History ────────────────────────────────────────────────────

export async function getInterviewHistory(limit = 50): Promise<InterviewResult[]> {
  try {
    // Get interview IDs sorted by date (newest first)
    const interviewIds = await redis.zrange('interviews:list', -limit, -1, { rev: true })
    
    if (!interviewIds || interviewIds.length === 0) {
      console.log('📊 No interviews found in Redis')
      return []
    }
    
    console.log(`📊 Found ${interviewIds.length} interview(s) in Redis`)
    
    // Fetch all interview data (Upstash SDK handles JSON deserialization automatically)
    const keys = interviewIds.map((id) => `interview:${id}`)
    const results = await redis.mget<InterviewResult[]>(...keys)
    
    // Filter out nulls and convert date strings to Date objects
    const interviews = results
      .filter((result): result is InterviewResult => result !== null)
      .map((result) => ({
        ...result,
        date: new Date(result.date), // Convert ISO string back to Date object
      }))
    
    console.log(`✅ Retrieved ${interviews.length} interview(s)`)
    return interviews
  } catch (error) {
    console.error('❌ Failed to get interview history:', error)
    return []
  }
}

// ─── Get Interview By ID ──────────────────────────────────────────────────────

export async function getInterviewById(id: string): Promise<InterviewResult | null> {
  try {
    console.log(`📄 Fetching interview with ID: ${id}`)
    const result = await redis.get<InterviewResult>(`interview:${id}`)
    
    if (!result) {
      console.log(`❌ Interview not found: ${id}`)
      return null
    }
    
    // Convert date string to Date object
    const interview = {
      ...result,
      date: new Date(result.date),
    }
    
    console.log(`✅ Retrieved interview: ${interview.jobTitle}`)
    return interview
  } catch (error) {
    console.error(`❌ Failed to get interview ${id}:`, error)
    return null
  }
}

// ─── Get Analytics Summary ────────────────────────────────────────────────────

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const interviews = await getInterviewHistory()
    
    if (interviews.length === 0) {
      // Return empty state with demo data structure
      return {
        totalInterviews: 0,
        averageScore: 0,
        categoryAverages: {
          technical: 0,
          experience: 0,
          communication: 0,
          culturalFit: 0,
        },
        passRate: 0,
        recentInterviews: [],
        performanceTrend: [],
        insights: [],
        commonStrengths: [],
        commonImprovements: [],
      }
    }
    
    // Calculate total interviews
    const totalInterviews = interviews.length
    
    // Calculate average scores
    const totalScore = interviews.reduce((sum, interview) => sum + interview.overallScore, 0)
    const averageScore = Math.round(totalScore / totalInterviews)
    
    // Calculate category averages
    const categoryTotals = interviews.reduce(
      (acc, interview) => {
        acc.technical += interview.categoryScores.technical
        acc.experience += interview.categoryScores.experience
        acc.communication += interview.categoryScores.communication
        acc.culturalFit += interview.categoryScores.culturalFit
        return acc
      },
      { technical: 0, experience: 0, communication: 0, culturalFit: 0 }
    )
    
    const categoryAverages = {
      technical: Math.round(categoryTotals.technical / totalInterviews),
      experience: Math.round(categoryTotals.experience / totalInterviews),
      communication: Math.round(categoryTotals.communication / totalInterviews),
      culturalFit: Math.round(categoryTotals.culturalFit / totalInterviews),
    }
    
    // Calculate pass rate
    const passCount = interviews.filter((interview) => interview.decision === 'pass').length
    const passRate = Math.round((passCount / totalInterviews) * 100)
    
    // Get recent interviews (last 5)
    const recentInterviews = interviews.slice(0, 5).map((interview) => ({
      id: interview.id,
      date: interview.date,
      jobTitle: interview.jobTitle,
      overallScore: interview.overallScore,
      decision: interview.decision,
    }))
    
    // Build performance trend (last 8 interviews)
    const trendInterviews = interviews.slice(0, 8).reverse()
    const performanceTrend = trendInterviews.map((interview) => ({
      date: new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      overall: interview.overallScore,
      technical: interview.categoryScores.technical,
      experience: interview.categoryScores.experience,
      communication: interview.categoryScores.communication,
      culturalFit: interview.categoryScores.culturalFit,
    }))
    
    // Aggregate insights from all interviews
    const allInsights = interviews.flatMap((interview) => interview.insights)
    const uniqueInsights = [...new Set(allInsights)].slice(0, 4)
    
    // Aggregate strengths from all interviews
    const strengthCounts = new Map<string, number>()
    interviews.forEach((interview) => {
      interview.strengths.forEach((strength) => {
        strengthCounts.set(strength, (strengthCounts.get(strength) || 0) + 1)
      })
    })
    const commonStrengths = Array.from(strengthCounts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    // Aggregate improvements from all interviews
    const improvementCounts = new Map<string, number>()
    interviews.forEach((interview) => {
      interview.improvements.forEach((improvement) => {
        improvementCounts.set(improvement, (improvementCounts.get(improvement) || 0) + 1)
      })
    })
    const commonImprovements = Array.from(improvementCounts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    return {
      totalInterviews,
      averageScore,
      categoryAverages,
      passRate,
      recentInterviews,
      performanceTrend,
      insights: uniqueInsights,
      commonStrengths,
      commonImprovements,
    }
  } catch (error) {
    console.error('Failed to get analytics summary:', error)
    // Return empty state on error
    return {
      totalInterviews: 0,
      averageScore: 0,
      categoryAverages: {
        technical: 0,
        experience: 0,
        communication: 0,
        culturalFit: 0,
      },
      passRate: 0,
      recentInterviews: [],
      performanceTrend: [],
      insights: [],
      commonStrengths: [],
      commonImprovements: [],
    }
  }
}

// ─── Delete Interview ────────────────────────────────────────────────────────

export async function deleteInterview(interviewId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await redis.del(`interview:${interviewId}`)
    await redis.zrem('interviews:list', interviewId)
    
    return { success: true }
  } catch (error) {
    console.error('Failed to delete interview:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ─── Clear All History ────────────────────────────────────────────────────────

export async function clearAllInterviews(): Promise<{ success: boolean; error?: string }> {
  try {
    const interviewIds = await redis.zrange('interviews:list', 0, -1)
    
    if (interviewIds && interviewIds.length > 0) {
      const keys = interviewIds.map((id) => `interview:${id}`)
      await redis.del(...keys)
      await redis.del('interviews:list')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Failed to clear interviews:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
