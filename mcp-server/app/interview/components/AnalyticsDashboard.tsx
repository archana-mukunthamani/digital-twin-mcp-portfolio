'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Briefcase,
  MessageCircle,
  Users,
  Code,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Download,
  Share2,
  Trash2,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentInterview {
  id: string
  date: Date
  jobTitle: string
  overallScore: number
  decision: 'pass' | 'conditional' | 'fail'
}

interface PerformanceTrendPoint {
  date: string
  overall: number
  technical: number
  experience: number
  communication: number
  culturalFit: number
}

interface AnalyticsData {
  totalInterviews: number
  averageScore: number
  categoryAverages: {
    technical: number
    experience: number
    communication: number
    culturalFit: number
  }
  passRate: number
  recentInterviews: RecentInterview[]
  performanceTrend: PerformanceTrendPoint[]
  insights: string[]
}

interface AnalyticsDashboardProps {
  analyticsData?: AnalyticsData
  onStartNewInterview?: () => void
  onViewTranscript?: (interviewId: string) => void
  onExportReport?: () => void
  onClearHistory?: () => void | Promise<void>
}

// ─── Demo data (shown when real data is sparse) ───────────────────────────────

const DEMO_DATA: AnalyticsData = {
  totalInterviews: 12,
  averageScore: 82,
  categoryAverages: { technical: 85, experience: 78, communication: 90, culturalFit: 82 },
  passRate: 83,
  recentInterviews: [
    { id: '1', date: new Date('2026-01-15'), jobTitle: 'Senior Full-Stack Engineer', overallScore: 88, decision: 'pass' },
    { id: '2', date: new Date('2026-01-10'), jobTitle: 'Staff Software Engineer', overallScore: 76, decision: 'conditional' },
    { id: '3', date: new Date('2026-01-05'), jobTitle: 'Lead Platform Engineer', overallScore: 91, decision: 'pass' },
    { id: '4', date: new Date('2025-12-28'), jobTitle: 'Principal Engineer, Cloud', overallScore: 62, decision: 'fail' },
    { id: '5', date: new Date('2025-12-20'), jobTitle: 'Engineering Manager', overallScore: 84, decision: 'pass' },
  ],
  performanceTrend: [
    { date: 'Dec 1', overall: 68, technical: 65, experience: 70, communication: 72, culturalFit: 68 },
    { date: 'Dec 8', overall: 72, technical: 70, experience: 74, communication: 76, culturalFit: 71 },
    { date: 'Dec 15', overall: 75, technical: 74, experience: 76, communication: 78, culturalFit: 75 },
    { date: 'Dec 20', overall: 79, technical: 78, experience: 78, communication: 82, culturalFit: 78 },
    { date: 'Dec 28', overall: 62, technical: 58, experience: 64, communication: 65, culturalFit: 62 },
    { date: 'Jan 5', overall: 91, technical: 90, experience: 88, communication: 94, culturalFit: 90 },
    { date: 'Jan 10', overall: 76, technical: 80, experience: 72, communication: 79, culturalFit: 74 },
    { date: 'Jan 15', overall: 88, technical: 85, experience: 84, communication: 90, culturalFit: 88 },
  ],
  insights: [
    'You excel at technical questions about cloud computing and distributed systems',
    'Communication scores are consistently high — a clear competitive strength',
    'Recent interviews show a 15% improvement trend over the past month',
    'Consider deepening algorithm and data-structure knowledge to lift technical scores',
  ],
}

const STRENGTHS = [
  { label: 'Strong AWS & cloud architecture knowledge', count: 8 },
  { label: 'Clear, structured communication style', count: 10 },
  { label: 'Deep system-design experience', count: 7 },
  { label: 'Leadership and mentorship examples', count: 6 },
  { label: 'Rapid problem decomposition', count: 5 },
]

const IMPROVEMENTS = [
  { label: 'Algorithm complexity analysis', count: 6 },
  { label: 'Low-level memory management', count: 4 },
  { label: 'Mobile-specific performance tuning', count: 3 },
  { label: 'Formal project management methodologies', count: 3 },
  { label: 'Security threat modelling depth', count: 2 },
]

// ─── Utility hooks ────────────────────────────────────────────────────────────

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.08 }
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
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
      }}
    >
      {children}
    </div>
  )
}

function useCountUp(target: number, duration = 1000, active = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return value
}

function useAnimatedProgress(target: number, active = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const timeout = setTimeout(() => setValue(target), 100)
    return () => clearTimeout(timeout)
  }, [target, active])
  return value
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CircularProgress({ pct, color }: { pct: number; color: string }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="88" height="88" className="-rotate-90" aria-hidden="true">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
      <circle
        cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  )
}

function DecisionBadge({ decision }: { decision: RecentInterview['decision'] }) {
  const map = {
    pass:        { label: 'Pass',        icon: CheckCircle,    cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    conditional: { label: 'Conditional', icon: AlertTriangle,  cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    fail:        { label: 'Fail',        icon: XCircle,        cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  }
  const { label, icon: Icon, cls } = map[decision]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon className="w-3 h-3" aria-hidden="true" />
      {label}
    </span>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 85 ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
    score >= 70 ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                  'bg-red-500/15 text-red-300 border-red-500/30'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}>
      {score}
    </span>
  )
}

type SortKey = 'date' | 'jobTitle' | 'overallScore' | 'decision'
type SortDir = 'asc' | 'desc'

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticsDashboard({
  analyticsData,
  onStartNewInterview = () => {},
  onViewTranscript = () => {},
  onExportReport = () => {},
  onClearHistory = () => {},
}: AnalyticsDashboardProps) {
  const resolved = analyticsData ?? DEMO_DATA
  const data = resolved.totalInterviews > 0 ? resolved : DEMO_DATA
  const isEmpty = resolved.totalInterviews === 0

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(0)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  // Generate shareable analytics summary
  const handleShareAnalytics = async () => {
    try {
      const summary = `🎯 Interview Analytics Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Performance Overview:
   • Total Interviews: ${data.totalInterviews}
   • Average Score: ${data.averageScore}/100
   • Pass Rate: ${data.passRate}%
   • Performance Trend: +${trendCount}% (Improving)

📈 Category Breakdown:
   • Technical Skills: ${data.categoryAverages.technical}/100
   • Relevant Experience: ${data.categoryAverages.experience}/100
   • Communication: ${data.categoryAverages.communication}/100
   • Cultural Fit: ${data.categoryAverages.culturalFit}/100

💪 Key Strengths:
${STRENGTHS.slice(0, 3).map(s => `   ✓ ${s.label}`).join('\n')}

📌 Recent Highlights:
${data.recentInterviews.slice(0, 2).map(i => 
  `   • ${i.jobTitle}: ${i.overallScore}/100 (${i.decision.toUpperCase()})`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleDateString()}
Powered by Digital Twin MCP Server
`.trim()

      await navigator.clipboard.writeText(summary)
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 3000)
      
      console.log('✅ Analytics summary copied to clipboard')
    } catch (error) {
      console.error('❌ Failed to copy analytics summary:', error)
    }
  }

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const passRateCount   = useCountUp(data.passRate, 1000, statsVisible)
  const avgScoreCount   = useCountUp(data.averageScore, 1000, statsVisible)
  const totalCount      = useCountUp(data.totalInterviews, 800, statsVisible)
  const trendCount      = useCountUp(15, 800, statsVisible)

  const techProgress  = useAnimatedProgress(data.categoryAverages.technical, statsVisible)
  const expProgress   = useAnimatedProgress(data.categoryAverages.experience, statsVisible)
  const commProgress  = useAnimatedProgress(data.categoryAverages.communication, statsVisible)
  const cultProgress  = useAnimatedProgress(data.categoryAverages.culturalFit, statsVisible)

  const passColor =
    data.passRate >= 80 ? '#10b981' :
    data.passRate >= 60 ? '#f59e0b' : '#ef4444'

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }, [sortKey])

  const PAGE_SIZE = 5
  const sortedInterviews = [...data.recentInterviews].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'date')         cmp = a.date.getTime() - b.date.getTime()
    else if (sortKey === 'jobTitle')cmp = a.jobTitle.localeCompare(b.jobTitle)
    else if (sortKey === 'overallScore') cmp = a.overallScore - b.overallScore
    else if (sortKey === 'decision')cmp = a.decision.localeCompare(b.decision)
    return sortDir === 'asc' ? cmp : -cmp
  })
  const totalPages = Math.ceil(sortedInterviews.length / PAGE_SIZE)
  const pageInterviews = sortedInterviews.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 opacity-40" />
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  const categories = [
    { label: 'Technical Skills',    value: techProgress,  raw: data.categoryAverages.technical,     icon: Code,          color: '#3b82f6', gradient: 'from-blue-600 to-blue-400' },
    { label: 'Relevant Experience', value: expProgress,   raw: data.categoryAverages.experience,    icon: Briefcase,     color: '#10b981', gradient: 'from-emerald-600 to-emerald-400' },
    { label: 'Communication',       value: commProgress,  raw: data.categoryAverages.communication, icon: MessageCircle, color: '#f59e0b', gradient: 'from-orange-600 to-amber-400' },
    { label: 'Cultural Fit',        value: cultProgress,  raw: data.categoryAverages.culturalFit,   icon: Users,         color: '#06b6d4', gradient: 'from-cyan-600 to-cyan-400' },
  ]

  // ─── Empty state ──────────────────────────────────────────────────────────

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-3">No interviews yet</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Complete your first interview to start tracking your performance analytics
          </p>
          <Button
            onClick={onStartNewInterview}
            className="px-8 py-5 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-600/30 transition-all duration-300 hover:scale-105"
          >
            Start Your First Interview
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  // ─── Full dashboard ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-slate-100 font-sans antialiased">

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-purple-700/15 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[380px] h-[380px] rounded-full bg-blue-700/15 blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-[320px] h-[320px] rounded-full bg-cyan-700/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 space-y-10">

        {/* ── Header ── */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-purple-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                Interview Analytics
              </h1>
              <p className="text-slate-400 mt-1.5">Track your performance across multiple interviews</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-4 py-2 text-base font-bold">
                {data.totalInterviews} Interviews
              </Badge>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value as typeof dateRange)}
                className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
                aria-label="Date range filter"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </FadeIn>

        {/* ── Summary Cards ── */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1: Pass Rate */}
          <FadeIn delay={0}>
            <div className="h-full backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="relative flex-shrink-0">
                <CircularProgress pct={passRateCount} color={passColor} />
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-100"
                  style={{ color: passColor }}>
                  {passRateCount}%
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{passRateCount}%</p>
                <p className="text-sm text-slate-400 font-medium">Pass Rate</p>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />+5% vs last period
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Card 2: Avg Score */}
          <FadeIn delay={80}>
            <div className="h-full backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs text-blue-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />+3 pts
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-100">{avgScoreCount}<span className="text-lg text-slate-500 font-normal">/100</span></p>
              <p className="text-sm text-slate-400 font-medium mt-1">Overall Performance</p>
              <Progress value={avgScoreCount} className="mt-3 h-1.5 bg-white/10 [&>div]:bg-blue-500" />
            </div>
          </FadeIn>

          {/* Card 3: Total Interviews */}
          <FadeIn delay={160}>
            <div className="h-full backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs text-purple-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />+3 this week
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-100">{totalCount}</p>
              <p className="text-sm text-slate-400 font-medium mt-1">Interviews Completed</p>
            </div>
          </FadeIn>

          {/* Card 4: Trend */}
          <FadeIn delay={240}>
            <div className="h-full backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs">Improving</Badge>
              </div>
              <p className="text-3xl font-bold text-emerald-400">+{trendCount}%</p>
              <p className="text-sm text-slate-400 font-medium mt-1">Performance Trend</p>
            </div>
          </FadeIn>
        </div>

        {/* ── Performance Trends Chart ── */}
        <FadeIn delay={100}>
          <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Score Progression Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.performanceTrend} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9' }}
                  labelStyle={{ color: '#cbd5e1', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: '16px', color: '#94a3b8', fontSize: 12 }} />
                <Line type="monotone" dataKey="overall"       stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, fill: '#a855f7' }} activeDot={{ r: 5 }} name="Overall" />
                <Line type="monotone" dataKey="technical"     stroke="#3b82f6" strokeWidth={2}   dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} name="Technical" />
                <Line type="monotone" dataKey="experience"    stroke="#10b981" strokeWidth={2}   dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} name="Experience" />
                <Line type="monotone" dataKey="communication" stroke="#f59e0b" strokeWidth={2}   dot={{ r: 3, fill: '#f59e0b' }} activeDot={{ r: 5 }} name="Communication" />
                <Line type="monotone" dataKey="culturalFit"   stroke="#06b6d4" strokeWidth={2}   dot={{ r: 3, fill: '#06b6d4' }} activeDot={{ r: 5 }} name="Cultural Fit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </FadeIn>

        {/* ── Category Breakdown ── */}
        <FadeIn delay={80}>
          <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Performance by Category</h2>
            <div className="space-y-5">
              {categories.map(({ label, value, raw, icon: Icon, color, gradient }, i) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-100">{raw}/100</span>
                  </div>
                  <div className="relative h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                      style={{
                        width: `${value}%`,
                        transition: `width 1s ease ${i * 120}ms`,
                        boxShadow: `0 0 8px ${color}50`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Recent Interviews Table ── */}
        <FadeIn delay={60}>
          <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Recent Interviews</h2>
                <p className="text-sm text-slate-500 mt-0.5">Your last {Math.min(data.recentInterviews.length, 5)} interviews</p>
              </div>
            </div>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm" role="table" aria-label="Recent interviews">
                <thead>
                  <tr className="border-b border-white/10">
                    {([
                      { key: 'date', label: 'Date' },
                      { key: 'jobTitle', label: 'Job Title' },
                      { key: 'overallScore', label: 'Score' },
                      { key: 'decision', label: 'Decision' },
                    ] as { key: SortKey; label: string }[]).map(col => (
                      <th key={col.key} className="pb-3 px-2 text-left">
                        <button
                          onClick={() => handleSort(col.key)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors"
                          aria-label={`Sort by ${col.label}`}
                        >
                          {col.label}
                          <SortIcon col={col.key} />
                        </button>
                      </th>
                    ))}
                    <th className="pb-3 px-2 text-left">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageInterviews.map((interview, i) => (
                    <tr
                      key={interview.id}
                      className="border-b border-white/[0.05] hover:bg-white/[0.04] transition-colors duration-150"
                    >
                      <td className="py-3.5 px-2 text-slate-300 whitespace-nowrap">
                        {interview.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-2 text-slate-200 max-w-[180px] truncate font-medium" title={interview.jobTitle}>
                        {interview.jobTitle}
                      </td>
                      <td className="py-3.5 px-2">
                        <ScoreBadge score={interview.overallScore} />
                      </td>
                      <td className="py-3.5 px-2">
                        <DecisionBadge decision={interview.decision} />
                      </td>
                      <td className="py-3.5 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewTranscript(interview.id)}
                          className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
                          aria-label={`View transcript for ${interview.jobTitle}`}
                        >
                          View Transcript
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                <span className="text-xs text-slate-500">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}
                    className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg">
                    Previous
                  </Button>
                  <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                    className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* ── Strengths & Weaknesses ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FadeIn delay={0}>
            <div className="h-full backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-100 mb-5">Common Strengths</h2>
              <ul className="space-y-3" aria-label="Common strengths list">
                {STRENGTHS.map(({ label, count }) => (
                  <li key={label} className="flex items-start gap-3 group">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">{label}</span>
                    </div>
                    <Badge className="flex-shrink-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/25 text-xs px-2 py-0.5">
                      {count}x
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="h-full backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-100 mb-5">Areas for Improvement</h2>
              <ul className="space-y-3" aria-label="Areas for improvement list">
                {IMPROVEMENTS.map(({ label, count }) => (
                  <li key={label} className="flex items-start gap-3 group">
                    <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">{label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/25 text-xs px-2 py-0.5">
                        {count}x
                      </Badge>
                      <Button variant="ghost" size="sm"
                        className="text-[10px] text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20 hover:border-orange-500/35 transition-all duration-200 h-auto">
                        Practice
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* ── AI Insights ── */}
        <FadeIn delay={60}>
          <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">AI-Generated Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-purple-500/20 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4 text-purple-400" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Action Buttons ── */}
        <FadeIn delay={40}>
          <div className="backdrop-blur-md bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-wrap items-center gap-3">
            <Button
              onClick={onStartNewInterview}
              className="px-6 py-5 font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
            >
              Start New Interview
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <Button
              onClick={onExportReport}
              variant="outline"
              className="px-6 py-5 font-semibold rounded-xl border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white transition-all duration-200"
            >
              <Download className="mr-2 w-4 h-4" aria-hidden="true" />
              Export Report
            </Button>

            <Button
              variant="outline"
              onClick={handleShareAnalytics}
              className={`px-6 py-5 font-semibold rounded-xl border-white/15 transition-all duration-200 ${
                shareSuccess 
                  ? 'bg-green-500/20 border-green-500/40 text-green-300' 
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white'
              }`}
              aria-label="Copy analytics summary to clipboard"
            >
              <Share2 className="mr-2 w-4 h-4" aria-hidden="true" />
              {shareSuccess ? 'Copied to Clipboard! ✓' : 'Share Analytics'}
            </Button>

            <div className="flex-1" />

            {!clearConfirm ? (
              <Button
                variant="ghost"
                onClick={() => setClearConfirm(true)}
                className="px-5 py-5 font-semibold rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/35 transition-all duration-200"
                aria-label="Clear interview history"
              >
                <Trash2 className="mr-2 w-4 h-4" aria-hidden="true" />
                Clear History
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2">
                <span className="text-sm text-red-300">Are you sure?</span>
                <Button 
                  size="sm" 
                  onClick={async () => {
                    if (onClearHistory) {
                      await onClearHistory()
                      setClearConfirm(false)
                    }
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white border-0 rounded-lg text-xs px-3 py-1.5 h-auto transition-all"
                >
                  Confirm
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setClearConfirm(false)}
                  className="text-slate-400 hover:text-slate-200 rounded-lg text-xs px-3 py-1.5 h-auto">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </FadeIn>

      </div>
    </div>
  )
}
