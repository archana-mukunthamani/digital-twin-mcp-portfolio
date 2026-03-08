'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getInterviewById, type InterviewResult } from '@/app/actions/interview-analytics'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Badge } from '@/components/badge'
import { ArrowLeft, Calendar, Briefcase, Target, MessageCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export default function TranscriptPage() {
  const router = useRouter()
  const params = useParams()
  const interviewId = params.id as string
  
  const [interview, setInterview] = useState<InterviewResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadInterview() {
      if (!interviewId) return
      
      try {
        const data = await getInterviewById(interviewId)
        if (data) {
          console.log('📄 Interview loaded:', {
            jobTitle: data.jobTitle,
            transcriptLength: data.transcript?.length || 0,
            hasTranscript: !!data.transcript,
          })
          setInterview(data)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Failed to load interview:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    
    loadInterview()
  }, [interviewId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading transcript...</div>
      </div>
    )
  }

  if (notFound || !interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Interview Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              The interview transcript you're looking for could not be found.
            </p>
            <Button onClick={() => router.push('/interview/analytics')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'pass':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Pass</Badge>
      case 'conditional':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><AlertTriangle className="w-3 h-3 mr-1" />Conditional</Badge>
      case 'fail':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Fail</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/interview/analytics')}
            className="mb-4 text-slate-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analytics
          </Button>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white mb-2 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-purple-400" />
                    Interview Transcript
                  </CardTitle>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {interview.jobTitle}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(interview.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Score: {interview.overallScore}/100
                    </div>
                  </div>
                </div>
                <div>
                  {getDecisionBadge(interview.decision)}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Job Description */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-white">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {interview.jobDescription}
            </p>
          </CardContent>
        </Card>

        {/* Q&A Transcript */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            Question & Answer Session ({interview.transcript?.length || 0} questions)
          </h2>

          {(!interview.transcript || interview.transcript.length === 0) ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="py-8 text-center">
                <p className="text-slate-400">No transcript data available for this interview.</p>
              </CardContent>
            </Card>
          ) : (
            interview.transcript.map((qa, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                        Question {index + 1}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                        Score: {qa.score}/10
                      </Badge>
                    </div>
                    <p className="text-white font-medium">{qa.question}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Answer */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Answer
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {qa.answer}
                  </p>
                </div>

                {/* Feedback */}
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    AI Feedback
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {qa.feedback}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </div>

        {/* Summary Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Strengths */}
          <Card className="bg-green-500/10 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-green-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {interview.strengths.map((strength, index) => (
                  <li key={index} className="text-green-200 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="bg-orange-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {interview.improvements.map((improvement, index) => (
                  <li key={index} className="text-orange-200 text-sm flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">⚠</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Category Scores */}
        <Card className="bg-slate-800/50 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-white">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(interview.categoryScores).map(([category, score]) => (
                <div key={category} className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {score}
                  </div>
                  <div className="text-xs text-slate-400 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => router.push('/interview/analytics')}
            className="px-8 py-6 text-lg bg-purple-600 hover:bg-purple-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Analytics Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
