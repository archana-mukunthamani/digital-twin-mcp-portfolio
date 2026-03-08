'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import { getAnalyticsSummary, clearAllInterviews, type AnalyticsSummary } from '@/app/actions/interview-analytics'

export default function AnalyticsPage() {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAnalyticsSummary()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  const handleStartNewInterview = () => {
    router.push('/interview')
  }

  const handleViewTranscript = (interviewId: string) => {
    router.push(`/interview/transcript/${interviewId}`)
  }

  const handleExportReport = () => {
    if (!analyticsData) {
      console.error('No analytics data to export')
      return
    }

    try {
      // Create JSON blob with formatted data
      const exportData = {
        exportDate: new Date().toISOString(),
        summary: {
          totalInterviews: analyticsData.totalInterviews,
          averageScore: analyticsData.averageScore,
          passRate: analyticsData.passRate,
          categoryAverages: analyticsData.categoryAverages,
        },
        interviews: analyticsData.recentInterviews,
        performanceTrend: analyticsData.performanceTrend,
        insights: analyticsData.insights,
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `interview-analytics-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log('✅ Analytics report exported successfully')
    } catch (error) {
      console.error('❌ Failed to export analytics report:', error)
    }
  }

  const handleClearHistory = async () => {
    try {
      await clearAllInterviews()
      // Reload analytics data after clearing
      setAnalyticsData(null)
      setLoading(true)
      const data = await getAnalyticsSummary()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Failed to clear interview history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900">
      <AnalyticsDashboard
        analyticsData={analyticsData || undefined}
        onStartNewInterview={handleStartNewInterview}
        onViewTranscript={handleViewTranscript}
        onExportReport={handleExportReport}
        onClearHistory={handleClearHistory}
      />
    </div>
  )
}
