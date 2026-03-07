# v0.dev Prompt for Analytics Dashboard

## 🎯 Complete Prompt for v0.dev (Analytics Component)

Copy and paste this entire prompt into v0.dev:

---

```
Create a comprehensive Interview Analytics Dashboard component for tracking performance across multiple technical interviews.

=== HEADER SECTION ===
- Title: "Interview Analytics"
- Subtitle: "Track your performance across multiple interviews"
- Total interviews count badge (large, prominent)
- Date range selector (dropdown: Last 7 days, Last 30 days, All time)

=== SUMMARY CARDS (4 cards in grid) ===

Card 1: Overall Success Rate
- Large percentage number (e.g., "85%")
- Circular progress indicator
- Subtitle: "Pass Rate"
- Trend indicator (+5% vs last period)
- Green/Yellow/Red color based on percentage

Card 2: Average Score
- Large score number out of 100 (e.g., "82/100")
- Progress bar
- Subtitle: "Overall Performance"
- Comparison to previous period

Card 3: Total Interviews
- Large number (e.g., "12")
- Icon: Briefcase or MessageSquare
- Subtitle: "Interviews Completed"
- Growth number (+3 this week)

Card 4: Improvement Trend
- Up/Down arrow with percentage
- Subtitle: "Performance Trend"
- "Improving" or "Declining" label
- Color coded (green for up, red for down)

=== PERFORMANCE TRENDS CHART ===
Title: "Score Progression Over Time"

- Line chart showing overall score for each interview
- X-axis: Interview date/number
- Y-axis: Score (0-100)
- Multiple lines for:
  * Overall Score (purple)
  * Technical Skills (blue)
  * Experience (green)
  * Communication (orange)
  * Cultural Fit (cyan)
- Hoverable data points with tooltip
- Smooth curve
- Grid lines (subtle)

Use recharts library components:
- LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend

=== CATEGORY BREAKDOWN ===
Title: "Performance by Category"

4 horizontal progress bars with labels:

1. Technical Skills
   - Average score (e.g., 85/100)
   - Gradient progress bar (blue)
   - Icon: Code

2. Relevant Experience
   - Average score (e.g., 78/100)
   - Gradient progress bar (green)
   - Icon: Briefcase

3. Communication
   - Average score (e.g., 90/100)
   - Gradient progress bar (orange)
   - Icon: MessageCircle

4. Cultural Fit
   - Average score (e.g., 82/100)
   - Gradient progress bar (cyan)
   - Icon: Users

Each bar should:
- Animate on load
- Show percentage label at end
- Color gradient from dark to light
- Glassmorphism container

=== RECENT INTERVIEWS TABLE ===
Title: "Recent Interviews"
Subtitle: "Your last 5 interviews"

Table columns:
1. Date (formatted: "Jan 15, 2026")
2. Job Title (truncated if long)
3. Score (with colored badge)
4. Decision (Pass/Conditional/Fail with icon)
5. Actions (View Details button)

Table features:
- Sortable columns
- Hover effect on rows
- Color-coded decision badges:
  * Pass = Green with checkmark
  * Conditional = Yellow with warning
  * Fail = Red with X
- "View Full Transcript" button for each row
- Pagination if > 5 interviews

=== STRENGTHS & WEAKNESSES SECTION ===
Two columns:

Left Column: "Common Strengths"
- List of top 5 strengths identified across interviews
- Each with frequency count (e.g., "Strong AWS knowledge (8 times)")
- Green checkmark icons
- Badge showing how many interviews mentioned it

Right Column: "Areas for Improvement"
- List of top 5 improvement areas
- Each with frequency count
- Orange warning icons
- Action buttons: "Find Resources" or "Practice"

=== INSIGHTS SECTION ===
Title: "AI-Generated Insights"

Cards showing:
- "You excel at technical questions about cloud computing"
- "Consider improving algorithm knowledge"
- "Your communication scores are consistently high"
- "Recent interviews show 15% improvement"

Each insight:
- Icon (Lightbulb)
- Short descriptive text
- Optional action button

=== ACTION BUTTONS (Footer) ===
- "Start New Interview" (primary, gradient)
- "Export Report" (PDF download)
- "Share Analytics" (generates shareable link)
- "Clear History" (danger button, with confirmation)

=== STYLING REQUIREMENTS ===

Color Scheme:
- Background: Dark gradient (from-slate-900 via-purple-900 to-slate-900)
- Cards: Glassmorphism (backdrop-blur, semi-transparent)
- Accent colors for each category
- Text: White/Gray hierarchy

Effects:
- Glassmorphism on all cards (backdrop-blur-md, bg-white/10)
- Smooth animations on data load (fade-in, slide-up)
- Chart animations (lines draw in)
- Hover effects on interactive elements
- Colored glows on score indicators

Typography:
- Title: 3xl-4xl, font-bold
- Card titles: xl, font-semibold
- Scores: 2xl-3xl, font-bold
- Body text: base, font-normal

Components to Use:
- shadcn/ui Card, Badge, Button, Progress
- shadcn/ui Table, Tabs, Separator
- recharts LineChart
- Lucide React icons (TrendingUp, TrendingDown, Award, Target, etc.)
- Tailwind CSS

Layout:
- Responsive grid (1 col mobile, 2 col tablet, 4 col desktop for summary cards)
- Max width: 7xl container
- Generous spacing and padding
- Clear visual hierarchy

Animations:
- Stagger animation for cards (one by one appearance)
- Progress bars animate from 0 to value
- Chart lines draw in smoothly
- Number counters animate up
- Smooth transitions (300ms)

=== EMPTY STATE ===
If no interviews yet (interviewCount === 0):
- Illustration or icon
- Message: "No interviews completed yet"
- Subtitle: "Complete your first interview to see analytics"
- CTA button: "Start Your First Interview"

=== TECHNICAL SPECIFICATIONS ===

Props Interface:
```typescript
interface AnalyticsDashboardProps {
  analyticsData: {
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
  }
  onStartNewInterview: () => void
  onViewTranscript: (interviewId: string) => void
  onExportReport: () => void
}
```

Framework: Next.js 14+ with TypeScript
Directive: 'use client' at top
Styling: Tailwind CSS
Charts: recharts
Icons: Lucide React
Components: shadcn/ui

Export as: AnalyticsDashboard.tsx

Create a visually stunning, professional, and data-rich analytics dashboard that would impress recruiters and showcase your ability to build production-ready analytics features.

Make it interactive, informative, and portfolio-worthy with smooth animations and a premium feel.
```

---

## 📋 Usage Instructions

### Step 1: Generate in v0.dev
1. Go to https://v0.dev
2. Copy the prompt above (between ``` markers)
3. Paste and generate
4. Review the component

### Step 2: Install Additional Dependencies
```powershell
cd mcp-server
pnpm add recharts
```

### Step 3: Save Component
Save generated code as:
```
mcp-server/app/interview/components/AnalyticsDashboard.tsx
```

### Step 4: Add Route
Create analytics page:
```typescript
// mcp-server/app/interview/analytics/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { getAnalyticsSummary } from '@/app/actions/interview-analytics'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      const analytics = await getAnalyticsSummary()
      setData(analytics)
      setLoading(false)
    }
    loadAnalytics()
  }, [])

  if (loading) return <div>Loading analytics...</div>

  return <AnalyticsDashboard analyticsData={data} {...handlers} />
}
```

### Step 5: Add Navigation
Update interview landing page to show "View Analytics" button when interviews > 1

---

## 🎨 Expected Visual Result

Professional analytics dashboard with:
- ✅ Summary cards with key metrics
- ✅ Animated line chart showing progress
- ✅ Category performance breakdown
- ✅ Recent interviews table
- ✅ AI-generated insights
- ✅ Export and sharing capabilities

Portfolio-ready feature that demonstrates:
- Data visualization skills
- Complex state management
- Production-ready analytics
- Professional UI/UX design

---

## 🔗 Integration Points

1. **After Interview Completion**: Automatically save results to Redis
2. **Landing Page**: Show interview count badge
3. **Navigation**: Add "Analytics" link in header
4. **Results Page**: Add "View Overall Analytics" button

---

Ready to generate! 🚀
