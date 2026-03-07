# v0.dev Prompt for Interview Landing Page

## 🎯 Complete Prompt for v0.dev

Copy and paste this entire prompt into v0.dev:

---

```
Create a modern, professional landing page for an AI-powered Digital Twin Interview Simulator with the following specifications:

=== HERO SECTION ===
Layout:
- Full viewport height section
- Dark background with animated gradient (purple to deep blue)
- Glassmorphism overlay card in center
- Subtle animated particles or grid pattern in background

Content:
- Main Title (large, bold): "AI Interview Simulator"
- Subtitle (medium): "Experience a technical interview powered by RAG and vector search"
- Description (regular): "Watch the Digital Twin conduct a realistic interview using retrieval-augmented generation"
- Primary CTA Button: "Start Interview" 
  * Prominent placement
  * Gradient background (purple to blue)
  * Glow effect on hover
  * Scale animation on hover
  * Arrow icon →

=== HOW IT WORKS SECTION ===
Title: "How It Works"
Subtitle: "Your AI-powered interview experience in 3 simple steps"

3 Step Cards (horizontal layout, mobile stacks vertically):

Step 1:
- Icon: Document or Clipboard icon
- Number badge: "1"
- Title: "Paste Job Description"
- Description: "Paste a job posting to analyze requirements and generate relevant questions"

Step 2:
- Icon: MessageSquare or Brain icon
- Number badge: "2"
- Title: "AI Conducts Interview"
- Description: "Digital Twin answers job-specific questions using RAG-powered retrieval"

Step 3:
- Icon: BarChart or CheckCircle icon
- Number badge: "3"
- Title: "Get Assessment"
- Description: "Receive comprehensive analysis, scores, and hiring recommendation"

Each card:
- Glassmorphism effect (backdrop blur, semi-transparent)
- Border glow on hover
- Smooth animations
- Icon with gradient color scheme

=== FEATURES GRID ===
Title: "Key Features"
Subtitle: "Powered by cutting-edge AI technology"

4 Feature Cards (2x2 grid, mobile stacks):

Card 1: "Job-Specific Questions"
- Icon: Target or Crosshair
- Description: "Analyzes job requirements and generates relevant questions automatically"
- Accent color: Purple

Card 2: "Real-Time Responses"
- Icon: Zap or Sparkles
- Description: "RAG-powered answers retrieved from professional profile vector database"
- Accent color: Blue

Card 3: "Performance Assessment"
- Icon: Award or Star
- Description: "Comprehensive scoring with strengths, improvements, and hiring recommendation"
- Accent color: Green

Card 4: "Interview Recording"
- Icon: FileText or Download
- Description: "Full transcript available for review and download"
- Accent color: Orange

Each card:
- Glassmorphism card with subtle border
- Icon in circle with gradient background
- Hover effect: lift and glow
- Smooth transitions

=== TECH SHOWCASE SECTION ===
Title: "Built With" (small, above badges)

Technology Badges (horizontal row, wraps on mobile):
- "Vector Search" badge (icon: Database)
- "Groq LLM" badge (icon: Cpu)
- "Upstash" badge (icon: Cloud)
- "Next.js" badge (icon: Code)

Each badge:
- Small pill-shaped
- Semi-transparent dark background
- Icon + text
- Subtle border
- Hover: slight scale and glow

=== JOB INPUT SECTION (BELOW FEATURES) ===
Title: "Start Your Interview"
Subtitle: "Paste a job description to begin"

Input Area:
- Large textarea component (min-height: 200px)
- Placeholder text: "Paste the job description here... Include role title, requirements, responsibilities, and qualifications."
- Character counter (bottom right)
- Border with gradient glow on focus
- Glassmorphism background

Action Button:
- "Begin Interview" button (large, prominent)
- Gradient purple to blue background
- Hover glow effect
- Disabled state when textarea is empty
- Show loading spinner when clicked

Validation:
- Minimum 50 characters required
- Show error message if too short: "Please provide a more detailed job description"

=== FOOTER SECTION ===
- "Ready to experience AI-powered interviews?"
- Small text: "Powered by Digital Twin Technology"
- Tech badges row

=== STYLING REQUIREMENTS ===

Color Scheme:
- Background: Dark gradient (from-purple-900 via-slate-900 to-blue-900)
- Primary: Purple (#8B5CF6)
- Secondary: Blue (#3B82F6)
- Accent: Cyan (#06B6D4)
- Text: White/Gray for hierarchy

Effects:
- Glassmorphism: backdrop-blur-md, bg-white/10
- Gradients: Purple to blue transitions
- Shadows: Colored glows (purple/blue)
- Animations: Smooth fades, scales, and slides

Typography:
- Title: 4xl-6xl, font-bold
- Subtitle: xl-2xl, font-semibold
- Body: base-lg, font-normal
- Use Inter or similar modern sans-serif

Components to Use:
- shadcn/ui Button (with custom variants)
- shadcn/ui Card
- shadcn/ui Badge
- shadcn/ui Textarea (for job description input)
- Lucide React icons
- Tailwind CSS for all styling

Layout:
- Max width: 7xl container
- Padding: Generous spacing (12-24px)
- Sections: Clear visual separation with spacing

Animations:
- Fade in on scroll (use framer-motion or CSS animations)
- Hover effects on all interactive elements
- Smooth transitions (200-300ms)
- CTA button pulse animation

Responsive Design:
- Mobile: Stack all cards vertically, reduce font sizes
- Tablet: 2-column grid for features
- Desktop: Full multi-column layouts
- All interactions touch-friendly

Accessibility:
- High contrast text
- ARIA labels on all buttons
- Keyboard navigation support
- Focus visible states

=== TECHNICAL SPECIFICATIONS ===

Framework: Next.js 14+ with TypeScript
Directive: 'use client' at top
Styling: Tailwind CSS
Icons: Lucide React
Components: shadcn/ui

Export as single page component: InterviewLanding.tsx

Props Interface:
```typescript
interface InterviewLandingProps {
  onStartInterview: (jobDescription: string) => void
}
```

The component should:
- Accept onStartInterview callback prop
- Validate textarea has minimum 50 characters
- Pass job description to parent via onStartInterview when "Begin Interview" is clicked
- Handle loading/disabled states appropriately

Create this as a self-contained, production-ready React component that can be dropped into a Next.js app/interview folder.

Make it visually stunning, professional, and portfolio-worthy. Prioritize smooth animations and a premium feel.
```

---

## 📋 Implementation Steps

### Step 1: Generate Component in v0.dev
1. Go to https://v0.dev
2. Paste the prompt above
3. Let v0 generate the component
4. Review and iterate if needed
5. Copy the generated code

### Step 2: Create Component File
Save the generated code as:
```
mcp-server/app/interview/components/InterviewLanding.tsx
```

### Step 3: Update page.tsx
Modify the interview page to use the new landing page:

```typescript
'use client'

import { useState } from 'react'
import InterviewLanding from './components/InterviewLanding'
// ... other imports

export default function InterviewPage() {
  const [step, setStep] = useState<'landing' | 'interview' | 'results'>('landing')
  const [jobDescription, setJobDescription] = useState('')

  const handleStartInterview = (jobDesc: string) => {
    setJobDescription(jobDesc)
    setStep('interview')
    // Start interview with job description
  }

  return (
    <div className="min-h-screen">
      {step === 'landing' && (
        <InterviewLanding onStartInterview={handleStartInterview} />
      )}
      
      {step === 'interview' && (
        // Your existing interview logic with jobDescription
        <div>Interview content...</div>
      )}
      
      {step === 'results' && (
        // Your existing results logic
        <div>Results content...</div>
      )}
    </div>
  )
}
```

### Step 4: Job Description Processing
The job description will be passed to your existing interview logic which:

1. Analyzes the job requirements
2. Generates role-specific questions
3. Conducts interview using Digital Twin RAG system
4. Provides assessment based on job fit

Your existing server actions should handle this workflow.

### Step 5: Test the Landing Page
1. Navigate to `/interview`
2. Verify hero section displays correctly
3. Test "Start Interview" button
4. Check responsiveness on mobile
5. Verify animations work smoothly

---

## 🎨 Alternative: Quick Customization

If v0.dev generates something close but needs tweaks, here are common adjustments:

### Adjust Gradient Background
```tsx
<div className="bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900">
```

### Modify Glassmorphism Effect
```tsx
<div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl">
```

### Change Button Style
```tsx
<Button 
  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
>
  Start Interview
</Button>
```

---

## 🚀 Next Steps After Landing Page

Once the landing page is complete:

1. **Interview Flow Component**: Create the live interview UI with typing animations
2. **General Questions Integration**: Wire up the 3 general questions
3. **Results Dashboard**: Build the assessment display
4. **Optional**: Add job posting paste functionality

---

## 💡 Design Tips for v0.dev

When reviewing v0's output, look for:
- ✅ Smooth animations (not janky)
- ✅ Proper glassmorphism (backdrop-blur + transparency)
- ✅ Responsive breakpoints (mobile, tablet, desktop)
- ✅ Proper TypeScript types for props
- ✅ Accessible button states
- ✅ Consistent spacing and alignment

If something looks off, you can iterate with v0 by saying:
- "Make the glassmorphism effect more subtle"
- "Add more spacing between sections"
- "Make the animations smoother"
- "Increase the gradient intensity"

---

## 📸 Expected Visual Result

Your landing page should look like:
- **Hero**: Full-screen dark gradient with glowing card in center
- **How It Works**: 3 cards with icons, numbers, smooth hover effects
- **Features**: 4 cards in grid with colored accents
- **Tech Badges**: Small pills showing your tech stack
- **CTA**: Large, glowing button at bottom

Premium feel, portfolio-ready, and professional.

---

Ready to generate? Copy the prompt and head to v0.dev! 🚀
