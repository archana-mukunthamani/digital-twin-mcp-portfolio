# 🤖 Digital Twin MCP Server

> An intelligent AI-powered digital twin assistant using Retrieval-Augmented Generation (RAG) to answer questions about professional profiles.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MCP Server](https://img.shields.io/badge/MCP-Server-green)](https://modelcontextprotocol.io/)
[![Upstash Vector](https://img.shields.io/badge/Upstash-Vector-red)](https://upstash.com/docs/vector/)

## 📋 Overview

This project implements a **Model Context Protocol (MCP) server** that acts as a digital twin assistant for professional profiles. It leverages **Retrieval-Augmented Generation (RAG)** to provide accurate, context-aware responses about a person's experience, skills, projects, and qualifications.

### Key Features

- 🔍 **Semantic Search**: Vector-based retrieval using Upstash Vector for accurate information retrieval
- 🧠 **RAG Architecture**: Combines retrieval with LLM generation for grounded responses
- 🎯 **Job Matching**: Analyzes job postings and matches qualifications
- 💬 **Interactive Interview**: Simulates technical interview scenarios with job-specific questions
- 📊 **Analytics Dashboard**: Track interview performance across multiple sessions with persistent storage
- 🗄️ **Data Persistence**: Interview results stored in Upstash Redis for cross-session analytics
- 🌐 **Dual Interface**: Works as both an MCP server (for VS Code/Claude Desktop) and a web UI

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Query / Interview                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              MCP Server / Web UI                             │
│  (Next.js 15 + TypeScript)                                  │
│  • Interview Landing Page                                   │
│  • Analytics Dashboard                                      │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────────┐  ┌────────────────────────────┐
│   Vector Search (Upstash)  │  │  Analytics DB (Redis)      │
│  • Semantic search         │  │  • Interview results       │
│  • Profile data retrieval  │  │  • Performance tracking    │
│  • Top-K retrieval (k=5)   │  │  • Trend calculation       │
│  • Metadata filtering      │  │  • Historic data           │
└────────────┬───────────────┘  └────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│          LLM Generation (Groq/Llama 3.3 70B)                │
│  • Context-aware response                                   │
│  • Grounded in retrieved data                               │
│  • Professional interview tone                              │
│  • STAR format responses                                    │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│         Response + Assessment + Analytics                    │
│  • Interview answers                                        │
│  • Performance scores                                       │
│  • Recommendations                                          │
│  • Stored for future analysis                               │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15.5.3 |
| **Language** | TypeScript (strict mode) |
| **Vector DB** | Upstash Vector |
| **Analytics DB** | Upstash Redis |
| **LLM** | Groq API (Llama 3.3 70B) |
| **UI** | ShadCN UI + Tailwind CSS |
| **Charts** | Recharts (data visualization) |
| **Protocol** | Model Context Protocol (MCP) |
| **Hosting** | Vercel (production ready) |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- Python 3.8+ (for scripts)
- Upstash Vector account
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/digital-twin-mcp-portfolio.git
   cd digital-twin-mcp-portfolio
   ```

2. **Install dependencies**
   ```bash
   cd mcp-server
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the `mcp-server` directory:
   ```env
   UPSTASH_VECTOR_REST_URL=your_upstash_vector_url
   UPSTASH_VECTOR_REST_TOKEN=your_upstash_vector_token
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Embed profile data**
   ```bash
   cd ../scripts
   python embed_digitaltwin.py
   ```

5. **Start the server**
   ```bash
   cd ../mcp-server
   pnpm dev
   ```

Visit `http://localhost:3000` to see the web UI.

## 📱 Usage Modes

### 1. MCP Server Mode (VS Code Agent)

Configure in VS Code settings or Claude Desktop:

```json
{
  "digital-twin": {
    "command": "node",
    "args": [
      "C:/path/to/mcp-server/.next/standalone/server.js"
    ],
    "env": {
      "UPSTASH_VECTOR_REST_URL": "your_url",
      "UPSTASH_VECTOR_REST_TOKEN": "your_token",
      "GROQ_API_KEY": "your_key"
    }
  }
}
```

Then query the digital twin directly from your IDE:
- "What are my recent projects?"
- "Do I have experience with React?"
- "What's my educational background?"

### 2. Web UI Mode

Access the interactive web interface at `http://localhost:3000`:
- Chat interface for asking questions
- Job posting analysis
- Technical interview simulation

### 3. API Mode

Make direct API calls to the MCP endpoint:

```typescript
const response = await fetch('/api/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "What are my Python skills?"
  })
});
```

## 🎯 Use Cases

### 1. **Job Application Tailoring**
```
Query: "How do my skills match this job posting?"
→ Analyzes job requirements against your profile
→ Highlights relevant experience
→ Suggests emphasis areas for cover letter
```

### 2. **Interview Preparation**
```
Query: "Prepare me for questions about my React experience"
→ Retrieves all React-related projects
→ Generates interview talking points
→ Suggests technical questions you might face
```

### 3. **Portfolio Summary**
```
Query: "Summarize my experience for a senior developer role"
→ Extracts relevant experiences
→ Highlights leadership and technical skills
→ Provides concise professional summary
```

### 4. **Technical Interview Simulation** 🆕
```
Feature: Job Description Paste Interface
→ User pastes job posting directly into web UI
→ System analyzes requirements and generates role-specific questions
→ Digital Twin conducts realistic interview using RAG
→ Provides comprehensive performance assessment with scores

Workflow:
1. Paste job description (minimum 50 characters)
2. AI generates 5 job-specific interview questions
3. Digital Twin answers questions based on professional profile
4. Receive detailed assessment:
   - Overall score (0-100)
   - Category scores (Technical, Experience, Communication, Cultural Fit)
   - Strengths and areas for improvement
   - Hiring recommendation (Pass/Conditional/Fail)
   - Full transcript available for review
```

### 5. **Interview Analytics Dashboard** 🆕
```
Feature: Performance Tracking Across Multiple Interviews
→ Store all interview results in Upstash Redis
→ Track performance trends over time
→ Visualize category-specific improvements
→ Generate insights and recommendations

Analytics Include:
- Total interviews conducted
- Average score and success rate
- Performance trends (line chart)
- Category breakdown (Technical, Experience, Communication, Cultural Fit)
- Recent interview history (last 5 interviews)
- Common strengths and improvement areas
- AI-generated performance insights
- Export capability (PDF reports)
```

## 📂 Project Structure

```
digital-twin-mcp-portfolio/
├── mcp-server/                        # Next.js MCP server
│   ├── app/
│   │   ├── api/mcp/                   # MCP endpoint
│   │   ├── interview/                 # Interview feature
│   │   │   ├── components/            # Landing page, analytics UI
│   │   │   └── page.tsx               # Interview orchestration
│   │   ├── actions/                   # Server actions
│   │   │   ├── interview-analytics.ts # Analytics CRUD operations
│   │   │   └── load-job-postings.ts   # Job posting handling
│   │   └── components/                # Shared UI components (shadcn/ui)
│   └── lib/
│       ├── digital-twin.ts            # Core RAG logic
│       └── redis.ts                   # Redis client for analytics
├── scripts/                           # Data processing scripts
│   ├── embed_digitaltwin.py           # Profile data embedding
│   └── embed_job_postings.py          # Job posting processing
├── data/                              # Profile data
│   └── digitaltwin_clean.json        # Professional profile
├── job-postings/                      # Sample job descriptions
└── docs/                              # Documentation
    ├── design.md                      # Technical design
    ├── prd.md                         # Product requirements
    └── VECTOR_SETUP_GUIDE.md          # Setup instructions
```

## 🔬 How It Works

### RAG Pipeline (Interview & Query Response)

1. **Data Preparation**
   - Professional profile stored in JSON format
   - Chunked into semantic sections (education, experience, projects, skills)
   - Each chunk embedded using Upstash's text embedding model
   - Stored in Upstash Vector with metadata tags

2. **Query Processing**
   - User query or interview question is converted to vector embedding
   - Semantic search retrieves top-5 most relevant chunks
   - Includes metadata (category, context) for better filtering
   - Results ranked by relevance score

3. **Response Generation**
   - Retrieved context passed to LLM (Llama 3.3 70B via Groq)
   - Explicit instructions to ground response in retrieved data
   - Temperature set to 0.3 for factual, grounded responses
   - Professional, accurate, and context-aware interview answers
   - STAR format for behavioral questions

4. **Assessment & Storage**
   - Interview responses evaluated across multiple categories
   - Performance scores calculated (Technical, Experience, Communication, Cultural Fit)
   - Results stored in Upstash Redis for analytics
   - Hiring recommendation generated (Pass/Conditional/Fail)

### Analytics Pipeline

1. **Data Collection**
   - Each interview result saved to Upstash Redis
   - Stored with timestamp, scores, job details, and full transcript
   - Indexed for efficient retrieval and aggregation

2. **Trend Calculation**
   - Historical data retrieved from Redis
   - Average scores calculated across all interviews
   - Performance trends identified over time
   - Success rates computed by decision type

3. **Visualization**
   - Line charts showing score progression
   - Category breakdowns with progress bars
   - Recent interview history in data tables
   - AI-generated insights based on patterns

### Vector Search Configuration

```typescript
const results = await index.query({
  data: query,
  topK: 5,  // Increased for better context
  includeMetadata: true
});
```

### Analytics Storage Schema

```typescript
interface InterviewResult {
  id: string
  timestamp: number
  jobTitle: string
  overallScore: number
  categoryScores: {
    technical: number
    experience: number
    communication: number
    culturalFit: number
  }
  strengths: string[]
  improvements: string[]
  decision: 'pass' | 'conditional' | 'fail'
  transcript: Array<{ role: string; content: string }>
}
```

## 👤 Author

**Archana Mukunthamani** - *Primary Developer & Sole Contributor*

- 🎯 Complete system architecture and implementation
- 🧠 RAG pipeline development with Upstash Vector and Groq LLM
- 🎤 Technical interview simulator feature
- 🌐 Web UI design and development
- 🚀 Vercel deployment and production configuration
- 📊 94% of all commits and entire core functionality

**GitHub**: [@archana-mukunthamani](https://github.com/archana-mukunthamani)

### Acknowledgments

This project was initially started as a team project. Special thanks to:
- **Himani1201** - Initial repository setup and README template
- **vivian** - Initial AGENTS.md documentation file

*Note: After initial setup, this project was designed, developed, and completed entirely by Archana Mukunthamani.*

---

**Built with ❤️ by Archana Mukunthamani**

## 🎓 Learning Outcomes

This project demonstrates proficiency in:

- ✅ Building production-ready MCP servers
- ✅ Implementing RAG architectures
- ✅ Working with vector databases
- ✅ Next.js 15 server actions and API routes
- ✅ TypeScript strict typing
- ✅ UI/UX design with ShadCN
- ✅ LLM integration (Groq API)
- ✅ Environment management and deployment

## 📊 Performance Metrics

- **Response Time**: ~2-3 seconds (including LLM)
- **Search Accuracy**: Top-K retrieval with semantic matching
- **Context Window**: Optimized for 3 relevant chunks
- **Error Handling**: Comprehensive fallbacks and validation

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `UPSTASH_VECTOR_REST_URL`
   - `UPSTASH_VECTOR_REST_TOKEN`
   - `GROQ_API_KEY`
4. Deploy!

The app is configured with `vercel.json` for optimal Next.js 15 deployment.

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Feel free to:
- Open issues for bugs or improvements
- Submit pull requests
- Share feedback

## 📄 License

MIT License - feel free to use this project as a reference or starting point for your own digital twin assistant.

## 👤 Contact

**Your Name**
- LinkedIn: [your-linkedin-url]
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Reference architecture from [Roll Dice MCP Server](https://github.com/gocallum/rolldice-mcpserver.git)
- RAG implementation inspired by [Digital Twin Python Reference](https://github.com/gocallum/binal_digital-twin_py.git)
- Built as part of internship project at Ausbiz Consulting

---

⭐ **If you find this project useful, please consider giving it a star!**
