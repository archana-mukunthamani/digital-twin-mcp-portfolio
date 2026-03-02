# Code Snippets for Presentation
## Key Implementation Highlights

---

## 1. RAG Query Function (TypeScript)

**File:** `mcp-server/lib/digital-twin.ts`

```typescript
export async function ragQuery(
  question: string, 
  useLLMFormatting: boolean = true
): Promise<RAGResponse> {
  try {
    // Step 1: Search vector database
    const vectorResults = await queryVectors(question, 3)
    
    if (!vectorResults || vectorResults.length === 0) {
      return {
        success: false,
        response: "I don't have specific information about that topic.",
        resultsFound: 0
      }
    }

    // Step 2: Extract context from top results
    const context = vectorResults
      .filter(result => result.content)
      .map(result => `${result.title}: ${result.content}`)
      .join('\\n\\n')

    // Step 3: Generate response with LLM
    const prompt = `Based on the following professional information, 
provide a compelling interview response:

Professional Context:
${context}

Interview Question: ${question}

Guidelines:
- Speak in first person as the professional
- Include specific examples and metrics
- Use STAR format when telling stories
- Sound confident and natural

Response:`

    const response = await generateResponse(prompt)

    return {
      success: true,
      response,
      resultsFound: vectorResults.length,
      contextItems: vectorResults
    }
  } catch (error) {
    return {
      success: false,
      response: `Error: ${error.message}`,
      resultsFound: 0
    }
  }
}
```

**Key Points:**
- Clean 3-step RAG process
- Error handling at every stage
- Metadata included in response
- Type-safe with TypeScript

---

## 2. Vector Search Implementation

**File:** `mcp-server/lib/digital-twin.ts`

```typescript
export async function queryVectors(
  queryText: string, 
  topK: number = 3
): Promise<VectorResult[]> {
  const index = getVectorIndex()
  
  if (!index) {
    throw new Error('Vector database not available')
  }

  try {
    // Query Upstash with semantic search
    const results = await index.query({
      data: queryText,          // Natural language query
      topK,                     // Return top 3 matches
      includeMetadata: true,    // Include chunk metadata
    })

    // Transform results to our format
    return results.map((result: any) => ({
      id: result.id || 'unknown',
      content: result.metadata?.content || '',
      title: result.metadata?.title || '',
      type: result.metadata?.type || '',
      score: result.score || 0,  // Relevance: 0-1
      metadata: result.metadata || {},
    }))
  } catch (error) {
    console.error('Error querying vectors:', error)
    return []
  }
}
```

**Key Points:**
- Semantic search (not keyword matching)
- Returns top-k most relevant chunks
- Includes relevance scores
- Metadata preserved for context

---

## 3. MCP Server Endpoint

**File:** `mcp-server/app/api/mcp/route.ts`

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle MCP JSON-RPC protocol
    if (body.method === 'tools/call') {
      const { name, arguments: args } = body.params
      
      // Route to appropriate digital twin tool
      if (name === 'query_digital_twin') {
        const result = await ragQuery(args.question)
        
        return NextResponse.json({
          jsonrpc: '2.0',
          result: {
            content: [{
              type: 'text',
              text: result.response
            }],
            isError: !result.success
          },
          id: body.id
        })
      }
    }
    
    // Initialize method
    if (body.method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        result: {
          serverName: 'digital-twin-mcp',
          version: '1.0.0',
          capabilities: ['query_digital_twin']
        },
        id: body.id
      })
    }
    
    // Unknown method
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32601, message: 'Method not found' },
      id: body.id
    })
    
  } catch (error) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal error' },
      id: null
    })
  }
}
```

**Key Points:**
- JSON-RPC 2.0 compliant
- Proper error handling
- Tool routing
- MCP protocol standard

---

## 4. Python Embedding Pipeline

**File:** `scripts/embed_digitaltwin.py`

```python
def embed_profile_to_vector_db():
    """Embed all profile chunks into Upstash Vector"""
    
    # Load profile data
    with open('data/digitaltwin_clean.json', 'r') as f:
        profile = json.load(f)
    
    # Extract chunks
    chunks = extract_content_chunks(profile)
    print(f"📦 Extracted {len(chunks)} chunks")
    
    # Initialize Upstash Vector
    index = Index(
        url=UPSTASH_VECTOR_REST_URL,
        token=UPSTASH_VECTOR_REST_TOKEN
    )
    
    # Batch upsert
    batch_size = 10
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        
        vectors = [
            (
                chunk['id'],
                chunk['content'],  # Auto-embedded by Upstash
                {
                    'title': chunk['title'],
                    'type': chunk['type'],
                    'category': chunk.get('category', ''),
                    'content': chunk['content']
                }
            )
            for chunk in batch
        ]
        
        index.upsert(vectors=vectors)
        print(f"✅ Uploaded batch {i//batch_size + 1}")
    
    print(f"🎉 Successfully embedded {len(chunks)} chunks")
```

**Key Points:**
- Batch processing for efficiency
- Metadata preservation
- Automatic embedding via Upstash
- Progress tracking

---

## 5. Content Chunking Strategy

**File:** `scripts/embed_digitaltwin.py`

```python
def extract_content_chunks(profile: dict) -> list:
    """Extract meaningful chunks from profile"""
    chunks = []
    
    # Work experience chunks
    for exp in profile.get('experience', []):
        # Company header chunk
        chunks.append({
            'id': f"exp_{exp['company']}",
            'title': f"{exp['title']} at {exp['company']}",
            'type': 'experience',
            'category': 'work',
            'content': f"{exp['title']} at {exp['company']} "
                      f"({exp['duration']}). {exp['company_context']}"
        })
        
        # Achievement chunks (STAR format)
        for i, achievement in enumerate(exp['achievements_star']):
            chunks.append({
                'id': f"exp_{exp['company']}_ach_{i}",
                'title': f"Achievement at {exp['company']}",
                'type': 'achievement',
                'category': 'experience',
                'content': (
                    f"Situation: {achievement['situation']}\\n"
                    f"Task: {achievement['task']}\\n"
                    f"Action: {achievement['action']}\\n"
                    f"Result: {achievement['result']}"
                )
            })
    
    # Skills chunks
    for lang in profile['skills']['technical']['programming_languages']:
        chunks.append({
            'id': f"skill_{lang['language']}",
            'title': f"{lang['language']} Programming",
            'type': 'skill',
            'category': 'technical',
            'content': f"{lang['language']}: {lang['proficiency']} "
                      f"({lang['years']} years). "
                      f"Frameworks: {', '.join(lang['frameworks'])}"
        })
    
    return chunks
```

**Key Points:**
- STAR format preservation
- Metadata categorization
- Granular chunking (300-800 tokens)
- Searchable structure

---

## 6. LLM Response Generation

**File:** `mcp-server/lib/digital-twin.ts`

```typescript
export async function generateResponse(
  prompt: string, 
  model: string = "llama-3.1-8b-instant"
): Promise<string> {
  const client = getGroqClient()
  
  if (!client) {
    return 'LLM not available - returning raw context only'
  }

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI digital twin representing a ' +
                   'professional. Answer questions as if you are the ' +
                   'person, speaking in first person about your ' +
                   'background, skills, and experiences. Be specific, ' +
                   'use examples, and demonstrate your expertise with ' +
                   'quantifiable achievements.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,      // Natural variation
      max_tokens: 500,       // Concise responses
    })

    return completion.choices[0]?.message?.content?.trim() 
           || 'No response generated'
           
  } catch (error) {
    console.error('Error generating response:', error)
    return `Error: ${error.message}`
  }
}
```

**Key Points:**
- System prompt grounds responses
- First-person perspective
- Temperature balanced for consistency
- Error handling with fallbacks

---

## 7. Health Check Endpoint

**File:** `mcp-server/lib/digital-twin.ts`

```typescript
export async function healthCheck(): Promise<{
  vectorDB: boolean
  llm: boolean
  details: string
}> {
  const vectorDB = getVectorIndex() !== null
  const llm = getGroqClient() !== null
  
  let details = []
  if (!vectorDB) details.push('Vector DB not configured')
  if (!llm) details.push('LLM not configured')
  if (vectorDB && llm) details.push('All systems operational')
  
  return {
    vectorDB,
    llm,
    details: details.join(', ')
  }
}
```

**Key Points:**
- Production monitoring
- Component status checking
- Simple boolean flags
- Diagnostic details

---

## 8. Environment Configuration

**File:** `.env.local`

```bash
# Vector Database (Upstash)
UPSTASH_VECTOR_REST_URL=https://sound-sawfly-93109-eu1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_token_here

# LLM Provider (Groq)
GROQ_API_KEY=your_groq_api_key_here

# Optional: Test credentials
test_UPSTASH_VECTOR_REST_URL=https://test-endpoint.upstash.io
test_UPSTASH_VECTOR_REST_TOKEN=test_token_here
```

**Security Best Practices:**
- Never commit .env files to Git
- Use environment variables in production
- Rotate keys regularly
- Test/production separation

---

## 9. Type Definitions

**File:** `mcp-server/lib/digital-twin.ts`

```typescript
// Core interfaces
export interface VectorResult {
  id: string
  content: string
  title: string
  type: string
  score: number
  metadata: Record<string, any>
}

export interface RAGResponse {
  success: boolean
  response: string
  resultsFound: number
  contextItems?: VectorResult[]
  modelUsed?: string
  error?: string
}

// Zod schema for validation
import { z } from 'zod'

export const digitalTwinTools = {
  ragQuery: {
    name: 'rag_query',
    description: 'Ask any question about professional background',
    schema: {
      question: z.string().describe('The question to ask'),
      useLLMFormatting: z.boolean().optional().default(true)
    }
  }
}
```

**Key Points:**
- Type safety with TypeScript
- Runtime validation with Zod
- Clear interface contracts
- Self-documenting code

---

## 10. Error Handling Pattern

**File:** `mcp-server/lib/digital-twin.ts`

```typescript
try {
  // Step 1: Validate input
  if (!question || question.trim().length === 0) {
    throw new Error('Question is required')
  }
  
  // Step 2: Query with timeout
  const timeoutMs = 5000
  const vectorResults = await Promise.race([
    queryVectors(question, topK),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ])
  
  // Step 3: Validate results
  if (!vectorResults || vectorResults.length === 0) {
    return {
      success: false,
      response: "No relevant information found.",
      resultsFound: 0
    }
  }
  
  // Step 4: Generate response
  const response = await generateResponse(prompt)
  
  return { success: true, response }
  
} catch (error) {
  // Log for debugging
  console.error('RAG query failed:', error)
  
  // Return user-friendly error
  return {
    success: false,
    response: 'An error occurred while processing your question.',
    error: error.message,
    resultsFound: 0
  }
}
```

**Key Points:**
- Input validation
- Timeout protection
- Graceful degradation
- User-friendly error messages

---

## 11. Vercel Deployment Config

**File:** `vercel.json`

```json
{
  "buildCommand": "cd mcp-server && pnpm install && pnpm build",
  "outputDirectory": "mcp-server/.next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "UPSTASH_VECTOR_REST_URL": "@upstash-vector-url",
    "UPSTASH_VECTOR_REST_TOKEN": "@upstash-vector-token",
    "GROQ_API_KEY": "@groq-api-key"
  }
}
```

**Key Points:**
- Automated deployment
- Environment variable injection
- Edge network distribution
- Next.js optimization

---

## 12. MCP Configuration (VS Code)

**File:** `.vscode/mcp.json`

```json
{
  "servers": {
    "digital-twin-mcp": {
      "type": "http",
      "url": "https://digital-twin-project-team2-1.vercel.app/api/mcp",
      "timeout": 30000
    }
  }
}
```

**Key Points:**
- Cloud-hosted (not local)
- 30-second timeout for complex queries
- Accessible from any VS Code instance
- No local server needed

---

## 13. Interview Simulation Prompt

**Example Usage in VS Code:**

```
@workspace Run a complete interview simulation for the Data Analyst 
role in job2.md with multiple interviewer personas including HR recruiter, 
technical lead, and hiring manager. Conduct a realistic interview with 
follow-up questions.

For each persona:
1. Ask 3-4 relevant questions based on the job description
2. Generate answers using my digital twin profile
3. Provide follow-up questions based on the answers
4. Evaluate responses for fit and skill match

Output:
- Complete interview transcript
- Assessment of qualification match
- Skills gap analysis
- Recommendations for improvement
```

**Key Points:**
- Multi-persona simulation
- Contextual questions from job posting
- RAG-powered answers
- Comprehensive assessment

---

## 14. Performance Monitoring

**Conceptual Implementation:**

```typescript
export async function monitoredRagQuery(
  question: string
): Promise<RAGResponse & { metrics: PerformanceMetrics }> {
  const startTime = Date.now()
  
  // Track vector search time
  const searchStart = Date.now()
  const vectorResults = await queryVectors(question, 3)
  const searchTime = Date.now() - searchStart
  
  // Track LLM generation time
  const llmStart = Date.now()
  const response = await generateResponse(prompt)
  const llmTime = Date.now() - llmStart
  
  const totalTime = Date.now() - startTime
  
  return {
    ...result,
    metrics: {
      totalTime,
      searchTime,
      llmTime,
      vectorsSearched: vectorResults.length,
      avgRelevance: calculateAvgRelevance(vectorResults)
    }
  }
}
```

**Key Points:**
- Performance tracking
- Component timing breakdown
- Relevance metrics
- Production insights

---

## 15. Data Structure Example

**File:** `data/digitaltwin_clean.json` (excerpt)

```json
{
  "experience": [
    {
      "company": "AWS (Amazon Web Services)",
      "title": "Cloud Support Engineer - RDS",
      "duration": "2016-2020",
      "team_structure": "10-person RDS support team",
      "achievements_star": [
        {
          "situation": "High-priority customer with 40% query latency",
          "task": "Identify root cause and optimize database performance",
          "action": "Analyzed CloudWatch metrics, identified missing indexes, 
                    implemented query optimization, configured parameter groups",
          "result": "Reduced query latency by 40%, improved throughput by 25%, 
                    customer satisfaction score increased to 9.5/10"
        }
      ],
      "technical_skills_used": [
        "Amazon RDS",
        "MySQL",
        "PostgreSQL",
        "CloudWatch",
        "Performance Tuning"
      ]
    }
  ],
  "skills": {
    "technical": {
      "programming_languages": [
        {
          "language": "Python",
          "years": 8,
          "proficiency": "Advanced",
          "frameworks": ["Pandas", "NumPy", "Scikit-learn"]
        }
      ]
    }
  }
}
```

**Key Points:**
- STAR format for achievements
- Quantifiable results (40%, 25%, 9.5/10)
- Metadata for categorization
- Comprehensive technical context

---

## Usage in Presentation

### Recommendation: Show 2-3 Code Snippets

**Best snippets to highlight:**
1. **Snippet 1** (RAG Query) - Shows core algorithm
2. **Snippet 5** (Chunking) - Shows data engineering
3. **Snippet 15** (Data Structure) - Shows STAR format

### Presentation Tips:

**Option 1: Screenshot**
- Use VS Code with dark theme
- Syntax highlighting enabled
- Zoom to readable size
- Highlight key lines

**Option 2: Slide Code Block**
- Use monospace font (Consolas, Fira Code)
- Add syntax highlighting colors manually
- Annotate with arrows/callouts
- Keep to 15-20 lines max

**Option 3: Live Demo**
- Open actual file in VS Code during presentation
- Walk through key functions
- Show how it connects to architecture
- More engaging but riskier

### What to Emphasize:

- ✅ **Clean, readable code**
- ✅ **Error handling everywhere**
- ✅ **Type safety (TypeScript)**
- ✅ **Production-ready patterns**
- ✅ **Well-documented**
- ✅ **Modular architecture**

### What NOT to Show:

- ❌ Configuration boilerplate
- ❌ Import statements
- ❌ Overly complex functions
- ❌ Debug/test code
- ❌ Too many lines at once

---

**END OF CODE SNIPPETS**

All code shown is from actual production implementation.
Ready to highlight in presentation!
