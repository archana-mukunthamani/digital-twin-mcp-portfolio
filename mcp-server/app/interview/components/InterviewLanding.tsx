'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ClipboardList,
  MessageSquare,
  BarChart3,
  Target,
  Zap,
  Award,
  FileText,
  Database,
  Cpu,
  Cloud,
  Code,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Textarea } from '@/components/textarea'

interface InterviewLandingProps {
  onStartInterview?: (jobDescription: string) => void
  onViewAnalytics?: () => void
  interviewCount?: number
}

const steps = [
  {
    number: '1',
    icon: ClipboardList,
    title: 'Paste Job Description',
    description: 'Paste a job posting to analyze requirements and generate relevant questions',
    gradient: 'from-purple-500 to-violet-600',
    shadow: 'hover:shadow-purple-500/30',
  },
  {
    number: '2',
    icon: MessageSquare,
    title: 'AI Conducts Interview',
    description: 'Digital Twin answers job-specific questions using RAG-powered retrieval',
    gradient: 'from-blue-500 to-cyan-500',
    shadow: 'hover:shadow-blue-500/30',
  },
  {
    number: '3',
    icon: BarChart3,
    title: 'Get Assessment',
    description: 'Receive comprehensive analysis, scores, and hiring recommendation',
    gradient: 'from-cyan-500 to-teal-500',
    shadow: 'hover:shadow-cyan-500/30',
  },
]

const features = [
  {
    icon: Target,
    title: 'Job-Specific Questions',
    description: 'Analyzes job requirements and generates relevant questions automatically',
    gradient: 'from-purple-500 to-violet-600',
    hoverBorder: 'hover:border-purple-500/50',
    hoverShadow: 'hover:shadow-purple-500/20',
  },
  {
    icon: Zap,
    title: 'Real-Time Responses',
    description: 'RAG-powered answers retrieved from professional profile vector database',
    gradient: 'from-blue-500 to-indigo-600',
    hoverBorder: 'hover:border-blue-500/50',
    hoverShadow: 'hover:shadow-blue-500/20',
  },
  {
    icon: Award,
    title: 'Performance Assessment',
    description: 'Comprehensive scoring with strengths, improvements, and hiring recommendation',
    gradient: 'from-emerald-500 to-teal-500',
    hoverBorder: 'hover:border-emerald-500/50',
    hoverShadow: 'hover:shadow-emerald-500/20',
  },
  {
    icon: FileText,
    title: 'Interview Recording',
    description: 'Full transcript available for review and download',
    gradient: 'from-orange-500 to-amber-500',
    hoverBorder: 'hover:border-orange-500/50',
    hoverShadow: 'hover:shadow-orange-500/20',
  },
]

const techBadges = [
  { label: 'Vector Search', icon: Database },
  { label: 'Groq LLM', icon: Cpu },
  { label: 'Upstash', icon: Cloud },
  { label: 'Next.js', icon: Code },
]

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useFadeIn()
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {children}
    </div>
  )
}

export default function InterviewLanding({
  onStartInterview = async () => {},
  onViewAnalytics,
  interviewCount = 0,
}: InterviewLandingProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const charCount = jobDescription.length
  const isValid = charCount >= 50

  const handleBeginInterview = async () => {
    if (!isValid) {
      setError('Please provide a more detailed job description')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await onStartInterview(jobDescription)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToInput = () => {
    document.getElementById('job-input-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-blue-950 text-slate-100 font-sans antialiased">

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-3xl float-animation" />
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full bg-blue-700/20 blur-3xl float-animation" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-700/15 blur-3xl float-animation" style={{ animationDelay: '5.5s' }} />
      </div>

      {/* ======================== HERO ======================== */}
      <section className="relative flex items-center justify-center min-h-screen px-4 py-20">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #f1f5f9 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          {interviewCount > 0 && (
            <div className="flex justify-center mb-6">
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-4 py-1.5 text-sm font-medium">
                {interviewCount} interview{interviewCount !== 1 ? 's' : ''} completed
              </Badge>
            </div>
          )}

          {/* Glassmorphism hero card */}
          <div
            className="backdrop-blur-md bg-white/[0.06] border border-white/10 rounded-3xl px-8 md:px-14 py-16 shadow-2xl"
            style={{ boxShadow: '0 0 80px rgba(139,92,246,0.12), 0 0 160px rgba(59,130,246,0.08)' }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-balance mb-5 leading-tight bg-gradient-to-r from-purple-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              AI Interview Simulator
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-slate-300 mb-4 text-pretty">
              Experience a technical interview powered by RAG and vector search
            </p>
            <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Watch the Digital Twin conduct a realistic interview using retrieval-augmented generation
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={scrollToInput}
                className="group relative px-8 py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 pulse-glow"
                aria-label="Start Interview - scroll to job input"
              >
                Start Interview
                <ArrowRight className="ml-2 w-5 h-5 inline-block transition-transform duration-200 group-hover:translate-x-1" />
              </Button>

              {onViewAnalytics && (
                <Button
                  onClick={onViewAnalytics}
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-slate-100 hover:text-white transition-all duration-300 hover:border-purple-500/40"
                  aria-label="View Analytics Dashboard"
                >
                  <BarChart3 className="mr-2 w-5 h-5 inline-block" />
                  View Analytics
                </Button>
              )}
            </div>
          </div>

          {/* Tech badges below hero */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {techBadges.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/10 cursor-default"
              >
                <Icon className="w-4 h-4 text-purple-400" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== HOW IT WORKS ======================== */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">How It Works</h2>
              <p className="text-lg text-slate-400 text-pretty">Your AI-powered interview experience in 3 simple steps</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <FadeIn key={step.number} delay={i * 120}>
                  <div
                    className={`group relative h-full backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 hover:shadow-xl ${step.shadow}`}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                      </div>
                      <span className="text-6xl font-black text-white/8 leading-none select-none mt-1">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-3">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ======================== FEATURES GRID ======================== */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Key Features</h2>
              <p className="text-lg text-slate-400 text-pretty">Powered by cutting-edge AI technology</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <FadeIn key={feature.title} delay={i * 100}>
                  <div
                    className={`group h-full backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:shadow-xl ${feature.hoverBorder} ${feature.hoverShadow}`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ======================== JOB INPUT ======================== */}
      <section id="job-input-section" className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Start Your Interview</h2>
              <p className="text-lg text-slate-400 text-pretty">Paste a job description to begin</p>
            </div>

            <div
              className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-8"
              style={{ boxShadow: '0 0 60px rgba(139,92,246,0.08)' }}
            >
              <div className="relative">
                <Textarea
                  value={jobDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setJobDescription(e.target.value)
                    if (error && e.target.value.length >= 50) setError('')
                  }}
                  placeholder="Paste the job description here... Include role title, requirements, responsibilities, and qualifications."
                  className="min-h-[200px] bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 focus-visible:ring-purple-500/30 resize-none rounded-xl text-base leading-relaxed transition-all duration-200 pr-16"
                  aria-label="Job description"
                  aria-describedby={error ? 'jd-error' : 'jd-hint'}
                />
                <span
                  id="jd-hint"
                  className={`absolute bottom-3 right-4 text-xs select-none transition-colors duration-200 ${isValid ? 'text-emerald-400' : 'text-slate-600'}`}
                  aria-live="polite"
                >
                  {charCount} chars
                </span>
              </div>

              {error && (
                <p id="jd-error" role="alert" className="mt-3 text-sm text-red-400 flex items-center gap-1.5">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                  {error}
                </p>
              )}

              {!isValid && charCount > 0 && !error && (
                <p className="mt-2 text-xs text-slate-500">
                  {50 - charCount} more character{50 - charCount !== 1 ? 's' : ''} needed
                </p>
              )}

              <Button
                onClick={handleBeginInterview}
                disabled={!isValid || isLoading}
                className="w-full mt-6 py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                aria-label="Begin Interview with provided job description"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" aria-hidden="true" />
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    Begin Interview
                    <ArrowRight className="ml-2 w-5 h-5 inline-block" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className="relative z-10 border-t border-white/10 py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xl font-semibold text-slate-100 mb-2 text-balance">
            Ready to experience AI-powered interviews?
          </p>
          <p className="text-sm text-slate-500 mb-8">Powered by Digital Twin Technology</p>
          <div className="flex flex-wrap justify-center gap-3">
            {techBadges.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium"
              >
                <Icon className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
