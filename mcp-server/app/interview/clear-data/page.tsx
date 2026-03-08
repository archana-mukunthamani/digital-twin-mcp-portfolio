'use client'

import { useState } from 'react'
import { clearAllInterviews } from '@/app/actions/interview-analytics'
import { Button } from '@/components/button'
import { useRouter } from 'next/navigation'

export default function ClearDataPage() {
  const router = useRouter()
  const [clearing, setClearing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleClear = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL interview data? This cannot be undone!')) {
      return
    }

    setClearing(true)
    setResult(null)

    try {
      const response = await clearAllInterviews()
      
      if (response.success) {
        setResult({ success: true, message: '✅ All interview data cleared successfully!' })
      } else {
        setResult({ success: false, message: `❌ Failed: ${response.error}` })
      }
    } catch (error) {
      setResult({ success: false, message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-4">Clear Interview Data</h1>
        <p className="text-slate-300 mb-8">
          This will permanently delete all interview results and analytics data from Redis.
        </p>

        {result && (
          <div className={`mb-6 p-4 rounded-lg ${result.success ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'}`}>
            <p className={result.success ? 'text-green-300' : 'text-red-300'}>
              {result.message}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={handleClear}
            disabled={clearing}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
          >
            {clearing ? 'Clearing...' : 'Clear All Data'}
          </Button>
          
          <Button
            onClick={() => router.push('/interview')}
            variant="outline"
            className="flex-1 border-white/20 bg-white/5 hover:bg-white/10 text-white py-3"
          >
            Cancel
          </Button>
        </div>

        {result?.success && (
          <Button
            onClick={() => router.push('/interview/analytics')}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3"
          >
            View Analytics (Should be empty)
          </Button>
        )}
      </div>
    </div>
  )
}
