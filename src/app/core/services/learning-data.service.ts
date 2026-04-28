import { Injectable } from '@angular/core';
import { LearningModule } from '../models/learning.model';

@Injectable({ providedIn: 'root' })
export class LearningDataService {
  getModules(): LearningModule[] {
    return [
      {
        id: 'foundations',
        title: 'AI Foundations',
        description: 'Understand LLMs, prompting, and how Claude Opus thinks',
        icon: '🧠',
        color: '#6c5ce7',
        order: 1,
        lessons: [
          {
            id: 'what-are-llms',
            moduleId: 'foundations',
            title: 'What Are Large Language Models?',
            description: 'How LLMs work, tokens, context windows, and capabilities',
            order: 1,
            content: [
              { type: 'text', content: '## What is a Large Language Model?\n\nA Large Language Model (LLM) is a neural network trained on vast amounts of text data to understand and generate human language. Think of it as a system that has read billions of documents and learned patterns about how language works.\n\n### Key Concepts\n\n**Tokens** — LLMs process text as "tokens" (roughly word-parts). The sentence "Hello world" is 2 tokens, while "orchestration" might be 2-3 tokens.\n\n**Context Window** — The amount of text an LLM can "see" at once. Claude Opus has a 200K token context window — that\'s roughly 500 pages of text.\n\n**Temperature** — Controls randomness. Low temperature (0) = deterministic, predictable. High temperature (1) = creative, varied.' },
              { type: 'code', content: '// Example: Sending a message to Claude API\nconst response = await anthropic.messages.create({\n  model: "claude-opus-4-6-20250414",\n  max_tokens: 1024,\n  messages: [\n    { role: "user", content: "Explain microservices in 2 sentences" }\n  ]\n});', language: 'typescript' },
              { type: 'tip', content: 'Claude Opus 4 is the most capable model — it excels at complex reasoning, code generation, and multi-step planning. Use it for agent orchestration where quality matters most.' },
              { type: 'text', content: '### How Claude Differs from Other LLMs\n\n| Feature | Claude Opus | GPT-4 | Gemini |\n|---------|------------|-------|--------|\n| Context Window | 200K tokens | 128K tokens | 1M tokens |\n| Agent Mode | Native tool use | Function calling | Tool use |\n| Thinking | Extended thinking | Chain of thought | - |\n| Best For | Complex orchestration | General tasks | Long context |' }
            ],
            quiz: [
              { id: 'q1', question: 'What is a token in the context of LLMs?', options: ['A security credential', 'A roughly word-sized piece of text', 'A type of API key', 'A neural network layer'], correctIndex: 1, explanation: 'Tokens are the fundamental units that LLMs process. They are roughly word-sized pieces of text — a word might be 1-3 tokens.' },
              { id: 'q2', question: 'What is Claude Opus\'s context window?', options: ['32K tokens', '128K tokens', '200K tokens', '1M tokens'], correctIndex: 2, explanation: 'Claude Opus has a 200K token context window, allowing it to process approximately 500 pages of text at once.' }
            ]
          },
          {
            id: 'prompt-engineering',
            moduleId: 'foundations',
            title: 'Prompt Engineering Mastery',
            description: 'Craft effective prompts with system prompts, few-shot, and chain of thought',
            order: 2,
            content: [
              { type: 'text', content: '## The Art of Prompt Engineering\n\nPrompt engineering is how you communicate intent to AI. A great prompt is like a great brief — clear, specific, and structured.\n\n### The CRISP Framework\n\n- **C**ontext — Set the scene and role\n- **R**ole — Define who the AI should be\n- **I**nstructions — Clear, step-by-step directions\n- **S**pecifics — Constraints, format, examples\n- **P**urpose — What success looks like' },
              { type: 'code', content: '// System prompt example for a code review agent\nconst systemPrompt = `You are a senior software engineer reviewing code.\n\nYour responsibilities:\n1. Identify bugs and security vulnerabilities\n2. Suggest performance improvements\n3. Check adherence to SOLID principles\n4. Rate code quality on a scale of 1-10\n\nFormat your response as:\n## Summary\n[1-2 sentence overview]\n\n## Issues Found\n- [severity] description\n\n## Suggestions\n- description\n\n## Score: X/10`;', language: 'typescript' },
              { type: 'interactive', content: 'prompt-builder', metadata: { type: 'prompt-playground' } },
              { type: 'warning', content: 'Avoid vague prompts like "make it better" or "fix this." The more specific your instructions, the more reliable the output.' },
              { type: 'text', content: '### Few-Shot Prompting\n\nProvide examples to teach the model your expected pattern:\n' },
              { type: 'code', content: 'const messages = [\n  { role: "user", content: "Convert to Jira ticket: Users can\'t login after password reset" },\n  { role: "assistant", content: "**Title:** Login fails after password reset\\n**Type:** Bug\\n**Priority:** High\\n**Description:** Users who reset their password are unable to login...\\n**Acceptance Criteria:**\\n- [ ] User can login immediately after reset\\n- [ ] Session tokens are refreshed" },\n  { role: "user", content: "Convert to Jira ticket: Add dark mode to settings page" }\n];', language: 'typescript' }
            ],
            quiz: [
              { id: 'q1', question: 'What does the "R" in CRISP stand for?', options: ['Requirements', 'Role', 'Response', 'Rules'], correctIndex: 1, explanation: 'R stands for Role — defining who the AI should act as helps set the right tone, knowledge level, and perspective.' },
              { id: 'q2', question: 'What is few-shot prompting?', options: ['Sending multiple API calls', 'Providing examples in the prompt', 'Using a small model', 'Limiting token output'], correctIndex: 1, explanation: 'Few-shot prompting means providing examples of input/output pairs so the model learns the pattern you want.' }
            ]
          },
          {
            id: 'claude-tools',
            moduleId: 'foundations',
            title: 'Claude Tool Use & Function Calling',
            description: 'Enable Claude to use external tools, APIs, and databases',
            order: 3,
            content: [
              { type: 'text', content: '## Tool Use: Giving Claude Superpowers\n\nTool use (function calling) lets Claude interact with external systems — databases, APIs, file systems, and more. This is the foundation of agent behavior.\n\n### How It Works\n\n1. You define available tools with JSON schemas\n2. Claude decides when and which tool to call\n3. You execute the tool and return results\n4. Claude uses results to continue reasoning' },
              { type: 'code', content: 'import Anthropic from "@anthropic-ai/sdk";\n\nconst client = new Anthropic();\n\nconst tools = [\n  {\n    name: "get_jira_ticket",\n    description: "Retrieves a Jira ticket by ID with all details",\n    input_schema: {\n      type: "object",\n      properties: {\n        ticket_id: {\n          type: "string",\n          description: "The Jira ticket ID (e.g., PROJ-123)"\n        }\n      },\n      required: ["ticket_id"]\n    }\n  },\n  {\n    name: "create_branch",\n    description: "Creates a git branch from the ticket",\n    input_schema: {\n      type: "object",\n      properties: {\n        branch_name: { type: "string" },\n        base_branch: { type: "string", default: "main" }\n      },\n      required: ["branch_name"]\n    }\n  }\n];\n\nconst response = await client.messages.create({\n  model: "claude-opus-4-6-20250414",\n  max_tokens: 4096,\n  tools,\n  messages: [{\n    role: "user",\n    content: "Start working on PROJ-456"\n  }]\n});', language: 'typescript' },
              { type: 'tip', content: 'Claude will automatically decide which tools to call based on the conversation. You don\'t need to tell it — just define the tools clearly and let it reason.' },
              { type: 'diagram', content: 'tool-use-flow' }
            ],
            quiz: [
              { id: 'q1', question: 'Who executes the tool after Claude decides to call it?', options: ['Claude executes it internally', 'Your application code executes it', 'The Anthropic API executes it', 'The tool runs itself'], correctIndex: 1, explanation: 'Your application is responsible for executing the tool call and returning results to Claude. Claude only decides what to call and with what parameters.' }
            ]
          }
        ]
      },
      {
        id: 'agent-basics',
        title: 'Agent Architecture',
        description: 'Build autonomous AI agents that plan, execute, and iterate',
        icon: '🤖',
        color: '#00cec9',
        order: 2,
        lessons: [
          {
            id: 'what-is-an-agent',
            moduleId: 'agent-basics',
            title: 'What is an AI Agent?',
            description: 'Understand the agent loop: perceive, plan, act, observe',
            order: 1,
            content: [
              { type: 'text', content: '## AI Agents: Beyond Chat\n\nAn AI agent is a system that can autonomously plan and execute multi-step tasks. Unlike a chatbot that responds to single queries, an agent:\n\n- **Plans** — Breaks complex tasks into steps\n- **Acts** — Executes actions using tools\n- **Observes** — Analyzes results\n- **Iterates** — Adjusts its plan based on outcomes\n\n### The Agent Loop\n\n```\n┌─────────────────────────────────────┐\n│                                     │\n│   User Goal                         │\n│       │                             │\n│       ▼                             │\n│   ┌───────┐                         │\n│   │ THINK │ ← Analyze situation     │\n│   └───┬───┘                         │\n│       │                             │\n│       ▼                             │\n│   ┌───────┐                         │\n│   │  ACT  │ ← Use tools            │\n│   └───┬───┘                         │\n│       │                             │\n│       ▼                             │\n│   ┌─────────┐                       │\n│   │ OBSERVE │ ← Check results       │\n│   └───┬─────┘                       │\n│       │                             │\n│       ▼                             │\n│   Done? ──No──→ Back to THINK       │\n│     │                               │\n│    Yes                              │\n│     │                               │\n│     ▼                               │\n│   Return Result                     │\n│                                     │\n└─────────────────────────────────────┘\n```' },
              { type: 'code', content: '// A simple agent loop implementation\nasync function agentLoop(goal: string, tools: Tool[]) {\n  let messages = [\n    { role: "user", content: goal }\n  ];\n  \n  while (true) {\n    const response = await client.messages.create({\n      model: "claude-opus-4-6-20250414",\n      max_tokens: 4096,\n      system: AGENT_SYSTEM_PROMPT,\n      tools,\n      messages\n    });\n\n    // Check if agent wants to use a tool\n    if (response.stop_reason === "tool_use") {\n      const toolUse = response.content.find(b => b.type === "tool_use");\n      const result = await executeTool(toolUse.name, toolUse.input);\n      \n      messages.push({ role: "assistant", content: response.content });\n      messages.push({ \n        role: "user", \n        content: [{ type: "tool_result", tool_use_id: toolUse.id, content: result }]\n      });\n    } else {\n      // Agent is done\n      return response.content[0].text;\n    }\n  }\n}', language: 'typescript' },
              { type: 'agent-demo', content: 'simple-agent-loop' }
            ],
            quiz: [
              { id: 'q1', question: 'What differentiates an agent from a chatbot?', options: ['Agents use GPT-4', 'Agents can plan and execute multi-step tasks autonomously', 'Agents are faster', 'Agents don\'t need prompts'], correctIndex: 1, explanation: 'Agents can autonomously plan, execute, observe, and iterate — handling complex multi-step tasks without human intervention at each step.' }
            ]
          },
          {
            id: 'agent-patterns',
            moduleId: 'agent-basics',
            title: 'Agent Design Patterns',
            description: 'ReAct, Plan-and-Execute, Reflection, and Tool-use patterns',
            order: 2,
            content: [
              { type: 'text', content: '## Core Agent Patterns\n\n### 1. ReAct (Reasoning + Acting)\nThe agent alternates between reasoning about the situation and taking actions.\n\n### 2. Plan-and-Execute\nThe agent first creates a complete plan, then executes each step.\n\n### 3. Reflection\nThe agent reviews its own output and iterates to improve quality.\n\n### 4. Tool-Augmented Generation\nThe agent decides when external tools are needed vs. when it can answer directly.' },
              { type: 'code', content: '// Plan-and-Execute Pattern\nconst PLANNER_PROMPT = `You are a planning agent.\nGiven a complex task, break it into numbered steps.\nEach step should be atomic and achievable with available tools.\nOutput ONLY a JSON array of steps.`;\n\nconst EXECUTOR_PROMPT = `You are an execution agent.\nExecute the given step using available tools.\nReport the result clearly.`;\n\nasync function planAndExecute(task: string) {\n  // Phase 1: Plan\n  const planResponse = await client.messages.create({\n    model: "claude-opus-4-6-20250414",\n    system: PLANNER_PROMPT,\n    messages: [{ role: "user", content: task }]\n  });\n  const steps = JSON.parse(planResponse.content[0].text);\n\n  // Phase 2: Execute each step\n  const results = [];\n  for (const step of steps) {\n    const result = await executeStep(step, EXECUTOR_PROMPT);\n    results.push(result);\n  }\n\n  return results;\n}', language: 'typescript' },
              { type: 'code', content: '// Reflection Pattern\nasync function reflectAndImprove(task: string, initialOutput: string) {\n  const reflection = await client.messages.create({\n    model: "claude-opus-4-6-20250414",\n    messages: [{\n      role: "user",\n      content: `Task: ${task}\\n\\nOutput: ${initialOutput}\\n\\n` +\n        `Critique this output. What could be improved? ` +\n        `Rate quality 1-10 and suggest specific fixes.`\n    }]\n  });\n\n  // If quality < 8, iterate\n  if (extractScore(reflection) < 8) {\n    return await improveOutput(task, initialOutput, reflection);\n  }\n  return initialOutput;\n}', language: 'typescript' }
            ],
            quiz: [
              { id: 'q1', question: 'In the Plan-and-Execute pattern, what happens first?', options: ['Tools are registered', 'A complete plan is created', 'The first action is taken', 'The user approves the approach'], correctIndex: 1, explanation: 'In Plan-and-Execute, the agent first creates a complete plan broken into steps, then systematically executes each step.' }
            ]
          },
          {
            id: 'error-handling',
            moduleId: 'agent-basics',
            title: 'Agent Error Handling & Recovery',
            description: 'Build resilient agents that handle failures gracefully',
            order: 3,
            content: [
              { type: 'text', content: '## Building Resilient Agents\n\nAgents operate in unpredictable environments. They must handle:\n\n- **Tool failures** — APIs down, timeouts, invalid responses\n- **Reasoning errors** — Wrong assumptions, hallucinations\n- **Resource limits** — Token limits, rate limits, cost caps\n- **Unexpected states** — Data not matching expectations\n\n### Strategies\n\n1. **Retry with backoff** — Transient failures resolve themselves\n2. **Fallback tools** — Alternative paths to the same goal\n3. **Human-in-the-loop** — Escalate when confidence is low\n4. **Checkpointing** — Save progress to resume after failures\n5. **Budget guards** — Cap tokens/cost per task' },
              { type: 'code', content: '// Resilient agent with error handling\nasync function resilientAgent(goal: string) {\n  const MAX_RETRIES = 3;\n  const MAX_STEPS = 20;\n  const MAX_TOKENS_BUDGET = 100000;\n  let tokensUsed = 0;\n  let steps = 0;\n\n  while (steps < MAX_STEPS && tokensUsed < MAX_TOKENS_BUDGET) {\n    try {\n      const response = await withRetry(\n        () => client.messages.create({ /* ... */ }),\n        MAX_RETRIES\n      );\n      \n      tokensUsed += response.usage.input_tokens + response.usage.output_tokens;\n      steps++;\n\n      if (response.stop_reason === "end_turn") {\n        return { success: true, result: response.content };\n      }\n\n      // Handle tool calls with error recovery\n      const toolResult = await safeExecuteTool(response);\n      if (toolResult.error) {\n        // Let the agent know the tool failed\n        messages.push({\n          role: "user",\n          content: [{ \n            type: "tool_result", \n            tool_use_id: toolResult.id,\n            is_error: true,\n            content: `Tool failed: ${toolResult.error}. Try an alternative approach.`\n          }]\n        });\n      }\n    } catch (error) {\n      if (isRateLimit(error)) await sleep(60000);\n      else throw error;\n    }\n  }\n\n  return { success: false, reason: "Budget or step limit reached" };\n}', language: 'typescript' }
            ]
          }
        ]
      },
      {
        id: 'orchestration',
        title: 'Multi-Agent Orchestration',
        description: 'Coordinate multiple agents for complex workflows',
        icon: '🎭',
        color: '#fd79a8',
        order: 3,
        lessons: [
          {
            id: 'orchestration-patterns',
            moduleId: 'orchestration',
            title: 'Orchestration Patterns',
            description: 'Sequential, parallel, hierarchical, and event-driven architectures',
            order: 1,
            content: [
              { type: 'text', content: '## Multi-Agent Orchestration\n\nWhen tasks are too complex for a single agent, you orchestrate multiple specialized agents:\n\n### Patterns\n\n**Sequential Pipeline** — Agents work in order, each building on the previous output\n```\nAgent A → Agent B → Agent C → Result\n```\n\n**Parallel Fan-Out** — Multiple agents work simultaneously on different aspects\n```\n         ┌→ Agent A ─┐\nTask ────├→ Agent B ──├──→ Merge → Result\n         └→ Agent C ─┘\n```\n\n**Hierarchical** — An orchestrator agent delegates to specialist agents\n```\n      Orchestrator\n      /    |    \\\nAgent A  Agent B  Agent C\n```\n\n**Event-Driven** — Agents react to events and trigger other agents\n```\nEvent → Agent A → Event → Agent B → ...\n```' },
              { type: 'code', content: '// Hierarchical orchestration example\nconst ORCHESTRATOR_PROMPT = `You are a project orchestrator.\nYou have these specialist agents available:\n- code_agent: Writes and modifies code\n- review_agent: Reviews code for quality and security\n- test_agent: Writes and runs tests\n- deploy_agent: Handles deployment pipelines\n\nGiven a task, decide which agents to invoke and in what order.\nOutput a JSON plan with agent assignments.`;\n\nasync function orchestrate(task: string) {\n  const plan = await getOrchestrationPlan(task);\n  \n  for (const phase of plan.phases) {\n    if (phase.parallel) {\n      // Run agents in parallel\n      const results = await Promise.all(\n        phase.agents.map(a => runSpecialistAgent(a.name, a.task))\n      );\n      context.addResults(phase.id, results);\n    } else {\n      // Sequential execution\n      for (const agent of phase.agents) {\n        const result = await runSpecialistAgent(agent.name, agent.task);\n        context.addResult(phase.id, result);\n      }\n    }\n  }\n  \n  return context.getFinalResult();\n}', language: 'typescript' },
              { type: 'agent-demo', content: 'orchestration-simulator' }
            ],
            quiz: [
              { id: 'q1', question: 'In hierarchical orchestration, what does the orchestrator agent do?', options: ['Executes all tasks itself', 'Delegates tasks to specialist agents', 'Only handles errors', 'Manages the database'], correctIndex: 1, explanation: 'The orchestrator agent acts as a coordinator — it breaks down complex tasks and delegates sub-tasks to specialized agents, then synthesizes their results.' }
            ]
          },
          {
            id: 'jira-to-code',
            moduleId: 'orchestration',
            title: 'Jira-to-Code Pipeline',
            description: 'Automate the entire flow from ticket to deployed code',
            order: 2,
            content: [
              { type: 'text', content: '## From Jira Ticket to Deployed Code\n\nThis is the holy grail of development automation — an agent pipeline that:\n\n1. **Reads** a Jira ticket and understands requirements\n2. **Plans** the implementation approach\n3. **Codes** the solution with proper architecture\n4. **Tests** the implementation\n5. **Reviews** for quality and security\n6. **Deploys** via CI/CD pipeline\n\n### Architecture\n\n```\nJira Ticket\n    │\n    ▼\n┌─────────────────┐\n│ Ticket Analyzer │ ← Parses requirements, acceptance criteria\n└────────┬────────┘\n         │\n         ▼\n┌─────────────────┐\n│  Tech Planner   │ ← Designs architecture, identifies files\n└────────┬────────┘\n         │\n         ▼\n┌─────────────────┐\n│  Code Generator │ ← Writes implementation code\n└────────┬────────┘\n         │\n         ▼\n┌─────────────────┐\n│  Test Writer    │ ← Creates unit and integration tests\n└────────┬────────┘\n         │\n         ▼\n┌─────────────────┐\n│  Code Reviewer  │ ← Reviews for quality, security, patterns\n└────────┬────────┘\n         │\n         ▼\n┌─────────────────┐\n│  PR Creator     │ ← Creates PR with description\n└────────┬────────┘\n         │\n         ▼\n    Deployed!\n```' },
              { type: 'code', content: '// Full Jira-to-Code pipeline\nimport Anthropic from "@anthropic-ai/sdk";\n\nconst client = new Anthropic();\n\nasync function jiraToCode(ticketId: string) {\n  // Step 1: Analyze ticket\n  const ticket = await jiraClient.getTicket(ticketId);\n  const analysis = await analyzeTicket(ticket);\n  \n  // Step 2: Plan implementation\n  const plan = await client.messages.create({\n    model: "claude-opus-4-6-20250414",\n    system: `You are a senior architect. Given ticket analysis,\n      create a detailed implementation plan including:\n      - Files to create/modify\n      - Architecture decisions\n      - Dependencies needed\n      - Risk assessment`,\n    messages: [{ role: "user", content: JSON.stringify(analysis) }]\n  });\n\n  // Step 3: Generate code (using Claude Code in agent mode)\n  const code = await claudeCode.run({\n    prompt: `Implement the following plan:\\n${plan.content[0].text}`,\n    tools: ["Read", "Write", "Edit", "Bash", "Grep"],\n    maxTurns: 50\n  });\n\n  // Step 4: Write tests\n  const tests = await claudeCode.run({\n    prompt: `Write comprehensive tests for the changes just made`,\n    tools: ["Read", "Write", "Bash"]\n  });\n\n  // Step 5: Self-review\n  const review = await client.messages.create({\n    model: "claude-opus-4-6-20250414",\n    system: REVIEWER_PROMPT,\n    messages: [{ role: "user", content: `Review these changes:\\n${code.diff}` }]\n  });\n\n  // Step 6: Create PR\n  await github.createPR({\n    title: `[${ticketId}] ${ticket.summary}`,\n    body: generatePRDescription(analysis, plan, review),\n    branch: `feature/${ticketId.toLowerCase()}`\n  });\n}', language: 'typescript' },
              { type: 'agent-demo', content: 'jira-pipeline-demo' }
            ]
          },
          {
            id: 'claude-code-agent',
            moduleId: 'orchestration',
            title: 'Claude Code as an Agent',
            description: 'Use Claude Code CLI for autonomous development tasks',
            order: 3,
            content: [
              { type: 'text', content: '## Claude Code: The Development Agent\n\nClaude Code is Claude running in agent mode with access to your development environment. It can:\n\n- Read and write files\n- Run shell commands\n- Search codebases\n- Create git commits and PRs\n- Run tests and fix failures\n- Interact with external tools via MCP\n\n### Key Capabilities\n\n| Feature | Description |\n|---------|-------------|\n| Tool Use | File ops, git, shell, grep, glob |\n| MCP Servers | Jira, Confluence, Grafana, databases |\n| Extended Thinking | Deep reasoning for complex problems |\n| Hooks | Custom automation on events |\n| Sub-agents | Delegate to specialized workers |' },
              { type: 'code', content: '# Claude Code in action — autonomous development\n\n# Start a complex task\n$ claude "Implement the payment processing module from PROJ-789.\n  Read the Jira ticket for requirements, create the service,\n  add tests, and create a PR."\n\n# Claude Code will:\n# 1. Use Jira MCP to read the ticket\n# 2. Analyze the codebase structure\n# 3. Create necessary files\n# 4. Write implementation code\n# 5. Add unit tests\n# 6. Run tests to verify\n# 7. Create a git branch and PR', language: 'bash' },
              { type: 'code', content: '// Using Claude Code SDK programmatically\nimport { ClaudeCode } from "@anthropic-ai/claude-code";\n\nconst agent = new ClaudeCode({\n  model: "claude-opus-4-6-20250414",\n  maxTurns: 100,\n  systemPrompt: `You are a senior developer. Follow these standards:\n    - Write TypeScript with strict types\n    - Follow existing patterns in the codebase\n    - Add JSDoc for public APIs\n    - Write tests for all new code`,\n  tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],\n  mcpServers: {\n    jira: { command: "mcp-atlassian" },\n    grafana: { command: "mcp-grafana" }\n  }\n});\n\nconst result = await agent.run(\n  "Refactor the auth module to use OAuth2 with PKCE flow"\n);', language: 'typescript' },
              { type: 'tip', content: 'Claude Code with MCP servers (Jira, Grafana, Confluence) creates a powerful autonomous development pipeline — from reading requirements to monitoring deployed code.' }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: 'Advanced Patterns',
        description: 'Production-grade agent systems with MCP, memory, and evaluation',
        icon: '⚡',
        color: '#fdcb6e',
        order: 4,
        lessons: [
          {
            id: 'mcp-servers',
            moduleId: 'advanced',
            title: 'MCP: Model Context Protocol',
            description: 'Connect agents to any external system via standardized protocol',
            order: 1,
            content: [
              { type: 'text', content: '## MCP: Universal Agent Connectivity\n\nThe Model Context Protocol (MCP) standardizes how AI agents connect to external systems. Instead of building custom integrations, you use MCP servers that expose tools and resources.\n\n### Our MCP Stack\n\n- **Jira MCP** — Read/create/update tickets, manage sprints\n- **Confluence MCP** — Read/write documentation\n- **Grafana MCP** — Query metrics, check dashboards, manage incidents\n- **Git MCP** — Repository operations\n- **Database MCP** — Query and manage databases\n\n### How MCP Works\n\n```\n┌─────────────┐     ┌─────────────┐     ┌─────────────┐\n│   Claude    │────▶│ MCP Client  │────▶│ MCP Server  │\n│   (Agent)   │◀────│             │◀────│  (Jira)     │\n└─────────────┘     └─────────────┘     └─────────────┘\n                                              │\n                                              ▼\n                                        ┌─────────────┐\n                                        │  Jira API   │\n                                        └─────────────┘\n```' },
              { type: 'code', content: '// Claude Code settings with MCP servers\n// .claude/settings.json\n{\n  "mcpServers": {\n    "atlassian": {\n      "command": "npx",\n      "args": ["-y", "@anthropic/mcp-atlassian"],\n      "env": {\n        "JIRA_URL": "https://yourcompany.atlassian.net",\n        "JIRA_TOKEN": "${JIRA_TOKEN}"\n      }\n    },\n    "grafana": {\n      "command": "npx",\n      "args": ["-y", "@anthropic/mcp-grafana"],\n      "env": {\n        "GRAFANA_URL": "https://grafana.yourcompany.com",\n        "GRAFANA_TOKEN": "${GRAFANA_TOKEN}"\n      }\n    },\n    "postgres": {\n      "command": "npx",\n      "args": ["-y", "@anthropic/mcp-postgres"],\n      "env": {\n        "DATABASE_URL": "${DATABASE_URL}"\n      }\n    }\n  }\n}', language: 'json' },
              { type: 'text', content: '### Real-World Example: Incident Response Agent\n\nWith MCP servers configured, Claude can autonomously:\n1. Detect alert from Grafana\n2. Query metrics to understand scope\n3. Search codebase for relevant code\n4. Check recent deployments\n5. Create a Jira incident ticket\n6. Post findings to Confluence' }
            ]
          },
          {
            id: 'agent-memory',
            moduleId: 'advanced',
            title: 'Agent Memory & Context Management',
            description: 'Long-term memory, context compression, and knowledge retrieval',
            order: 2,
            content: [
              { type: 'text', content: '## Giving Agents Memory\n\nAgents need memory to maintain context across sessions and handle complex long-running tasks.\n\n### Types of Agent Memory\n\n| Type | Purpose | Implementation |\n|------|---------|----------------|\n| **Short-term** | Current conversation | Message history |\n| **Working** | Current task state | Scratchpad/notes |\n| **Long-term** | Cross-session knowledge | Vector DB / files |\n| **Episodic** | Past experiences | Stored conversations |\n\n### Claude Code\'s Memory System\n\nClaude Code uses file-based memory at `~/.claude/projects/` with:\n- **CLAUDE.md** — Project conventions and architecture\n- **Memory files** — User preferences, project context, feedback\n- **MEMORY.md** — Index of all stored memories' },
              { type: 'code', content: '// Implementing agent memory with vector search\nimport { ChromaClient } from "chromadb";\n\nclass AgentMemory {\n  private chroma = new ChromaClient();\n  private collection;\n\n  async initialize() {\n    this.collection = await this.chroma.getOrCreateCollection({\n      name: "agent-memories"\n    });\n  }\n\n  async store(memory: { content: string; metadata: object }) {\n    await this.collection.add({\n      ids: [crypto.randomUUID()],\n      documents: [memory.content],\n      metadatas: [memory.metadata]\n    });\n  }\n\n  async recall(query: string, topK = 5) {\n    const results = await this.collection.query({\n      queryTexts: [query],\n      nResults: topK\n    });\n    return results.documents[0];\n  }\n}\n\n// Agent uses memory to inform decisions\nasync function memoryAugmentedAgent(task: string) {\n  const memory = new AgentMemory();\n  await memory.initialize();\n\n  // Recall relevant past experiences\n  const relevantMemories = await memory.recall(task);\n  \n  const response = await client.messages.create({\n    model: "claude-opus-4-6-20250414",\n    system: `You have these relevant memories from past tasks:\n      ${relevantMemories.join("\\n")}`,\n    messages: [{ role: "user", content: task }]\n  });\n\n  // Store outcome for future reference\n  await memory.store({\n    content: `Task: ${task}\\nOutcome: ${response.content[0].text}`,\n    metadata: { timestamp: new Date().toISOString(), type: "task_outcome" }\n  });\n}', language: 'typescript' }
            ]
          },
          {
            id: 'evaluation',
            moduleId: 'advanced',
            title: 'Agent Evaluation & Observability',
            description: 'Measure agent performance, reliability, and cost',
            order: 3,
            content: [
              { type: 'text', content: '## Evaluating Agent Performance\n\nYou can\'t improve what you don\'t measure. Key metrics for agent systems:\n\n### Metrics\n\n- **Task Success Rate** — % of tasks completed correctly\n- **Steps to Completion** — Efficiency of agent reasoning\n- **Token Usage** — Cost per task\n- **Tool Call Accuracy** — Are tools called correctly?\n- **Latency** — Time from request to completion\n- **Error Recovery Rate** — % of errors self-resolved\n\n### Observability Stack\n\n```\n┌──────────────────────────────────────┐\n│          Agent Execution             │\n│                                      │\n│  ┌────────┐  ┌────────┐  ┌───────┐  │\n│  │ Traces │  │ Metrics│  │ Logs  │  │\n│  └───┬────┘  └───┬────┘  └───┬───┘  │\n└──────┼───────────┼───────────┼───────┘\n       │           │           │\n       ▼           ▼           ▼\n┌──────────────────────────────────────┐\n│         Grafana Dashboard            │\n│  ┌─────────┐ ┌──────────┐ ┌──────┐  │\n│  │Success  │ │Token Cost│ │Errors│  │\n│  │Rate: 94%│ │$0.12/task│ │  2%  │  │\n│  └─────────┘ └──────────┘ └──────┘  │\n└──────────────────────────────────────┘\n```' },
              { type: 'code', content: '// Agent evaluation framework\ninterface AgentEvaluation {\n  taskId: string;\n  metrics: {\n    success: boolean;\n    steps: number;\n    tokensUsed: number;\n    latencyMs: number;\n    toolCalls: { name: string; success: boolean }[];\n    cost: number;\n  };\n}\n\nclass AgentEvaluator {\n  private results: AgentEvaluation[] = [];\n\n  wrap(agentFn: Function) {\n    return async (...args: any[]) => {\n      const start = Date.now();\n      const evaluation: AgentEvaluation = {\n        taskId: crypto.randomUUID(),\n        metrics: { success: false, steps: 0, tokensUsed: 0,\n                   latencyMs: 0, toolCalls: [], cost: 0 }\n      };\n\n      try {\n        const result = await agentFn(...args);\n        evaluation.metrics.success = true;\n        return result;\n      } catch (error) {\n        evaluation.metrics.success = false;\n        throw error;\n      } finally {\n        evaluation.metrics.latencyMs = Date.now() - start;\n        this.results.push(evaluation);\n        await this.reportToGrafana(evaluation);\n      }\n    };\n  }\n\n  getSummary() {\n    const total = this.results.length;\n    const successes = this.results.filter(r => r.metrics.success).length;\n    return {\n      successRate: (successes / total * 100).toFixed(1) + "%",\n      avgSteps: avg(this.results.map(r => r.metrics.steps)),\n      avgCost: "$" + avg(this.results.map(r => r.metrics.cost)).toFixed(4),\n      avgLatency: avg(this.results.map(r => r.metrics.latencyMs)) + "ms"\n    };\n  }\n}', language: 'typescript' }
            ]
          }
        ]
      },
      {
        id: 'real-world',
        title: 'Real-World Automation',
        description: 'Complete automation recipes your team can use today',
        icon: '🚀',
        color: '#e17055',
        order: 5,
        lessons: [
          {
            id: 'dev-automation',
            moduleId: 'real-world',
            title: 'Development Automation Recipes',
            description: 'PR reviews, bug fixes, refactoring, documentation generation',
            order: 1,
            content: [
              { type: 'text', content: '## Automation Recipes for Daily Development\n\nThese are ready-to-use patterns your team can adopt immediately:\n\n### 1. Automated PR Review\nClaude Code reviews every PR for security, performance, and code quality.\n\n### 2. Bug Fix from Error Log\nAgent reads Grafana alerts, traces the bug, and creates a fix PR.\n\n### 3. Auto-Documentation\nGenerates and updates docs from code changes.\n\n### 4. Test Generation\nCreates comprehensive tests for new or modified code.\n\n### 5. Dependency Updates\nSafely updates dependencies, runs tests, fixes breaking changes.' },
              { type: 'code', content: '# Recipe: Auto PR Review Hook\n# .claude/settings.json hooks configuration\n{\n  "hooks": {\n    "on_pr_created": {\n      "command": "claude",\n      "args": [\n        "Review this PR. Check for:\\n1. Security vulnerabilities\\n2. Performance issues\\n3. Missing error handling\\n4. Test coverage gaps\\nPost review as PR comment."\n      ]\n    }\n  }\n}\n\n# Recipe: Bug fix from alert\n$ claude "There\'s a 500 error in the /api/payments endpoint.\n  1. Check Grafana for error patterns\n  2. Find the relevant code\n  3. Identify the root cause\n  4. Implement a fix\n  5. Add a test that reproduces the bug\n  6. Create a PR"', language: 'bash' },
              { type: 'code', content: '// Recipe: Automated test generation\n$ claude "Generate comprehensive tests for src/services/auth.service.ts.\n  Include:\n  - Unit tests for each public method\n  - Edge cases (null inputs, timeouts, invalid tokens)\n  - Integration test with mock OAuth provider\n  - Performance test for token validation"\n\n// Recipe: Documentation generation\n$ claude "Update the API documentation in docs/api.md based on:\n  1. Current route definitions in src/routes/\n  2. Request/response types in src/types/\n  3. Add examples for each endpoint\n  4. Mark deprecated endpoints"', language: 'bash' }
            ]
          },
          {
            id: 'incident-response',
            moduleId: 'real-world',
            title: 'Automated Incident Response',
            description: 'AI-powered incident detection, diagnosis, and resolution',
            order: 2,
            content: [
              { type: 'text', content: '## AI-Powered Incident Response\n\nAutomate the first 15 minutes of incident response:\n\n### The Pipeline\n\n1. **Detection** — Grafana alert fires\n2. **Triage** — Agent assesses severity and impact\n3. **Diagnosis** — Query logs, metrics, traces\n4. **Root Cause** — Correlate with recent changes\n5. **Mitigation** — Suggest or execute fix\n6. **Communication** — Update stakeholders\n\n### Integration Points\n\n- **Grafana** — Metrics, logs, alerts\n- **Git** — Recent deployments, blame\n- **Jira** — Create incident ticket\n- **Confluence** — Post-mortem template\n- **Slack** — Team notifications' },
              { type: 'code', content: '// Incident response agent\nasync function incidentResponseAgent(alert: GrafanaAlert) {\n  const context = {\n    alert,\n    metrics: await grafana.queryPrometheus(\n      `rate(http_errors_total{service="${alert.service}"}[5m])`\n    ),\n    logs: await grafana.queryLoki(\n      `{service="${alert.service}"} |= "error" | json`\n    ),\n    recentDeploys: await git.log({ since: "2 hours ago" }),\n  };\n\n  const diagnosis = await client.messages.create({\n    model: "claude-opus-4-6-20250414",\n    system: INCIDENT_ANALYST_PROMPT,\n    messages: [{\n      role: "user",\n      content: `Incident Alert:\\n${JSON.stringify(context, null, 2)}\\n\\n` +\n        `Diagnose this incident. Determine:\\n` +\n        `1. Severity (P1-P4)\\n` +\n        `2. Blast radius (which users/services affected)\\n` +\n        `3. Root cause hypothesis\\n` +\n        `4. Recommended mitigation`\n    }]\n  });\n\n  // Create Jira incident\n  await jira.createIssue({\n    type: "Incident",\n    summary: `[${diagnosis.severity}] ${alert.summary}`,\n    description: diagnosis.fullAnalysis\n  });\n\n  // Update Grafana incident\n  await grafana.createIncident({\n    title: alert.summary,\n    severity: diagnosis.severity,\n    labels: [alert.service]\n  });\n}', language: 'typescript' }
            ]
          },
          {
            id: 'team-workflows',
            moduleId: 'real-world',
            title: 'Team Workflow Automation',
            description: 'Sprint planning, standup summaries, knowledge management',
            order: 3,
            content: [
              { type: 'text', content: '## Automating Team Workflows\n\n### Sprint Planning Assistant\nAgent reads backlog, estimates complexity, suggests sprint composition.\n\n### Daily Standup Summary\nAgent compiles git activity, PR status, and blocker analysis.\n\n### Knowledge Base Builder\nAgent watches code changes and auto-updates Confluence docs.\n\n### Onboarding Agent\nNew team member asks questions → Agent answers using codebase + docs.' },
              { type: 'code', content: '// Sprint planning assistant\nasync function sprintPlanningAgent(sprintGoal: string) {\n  // Get backlog from Jira\n  const backlog = await jira.search(\n    "project = PROJ AND status = Backlog ORDER BY priority"\n  );\n\n  // Analyze each ticket for complexity\n  const analysis = await client.messages.create({\n    model: "claude-opus-4-6-20250414",\n    system: `You are a sprint planning assistant.\n      Team velocity: 40 story points per sprint.\n      Team size: 5 developers.\n      Sprint duration: 2 weeks.`,\n    messages: [{\n      role: "user",\n      content: `Sprint Goal: ${sprintGoal}\\n\\n` +\n        `Backlog:\\n${JSON.stringify(backlog)}\\n\\n` +\n        `Recommend a sprint composition that:\\n` +\n        `1. Aligns with the sprint goal\\n` +\n        `2. Stays within velocity\\n` +\n        `3. Balances tech debt and features\\n` +\n        `4. Considers dependencies between tickets`\n    }]\n  });\n\n  return analysis;\n}\n\n// Daily standup summary\nasync function standupSummary(teamMembers: string[]) {\n  const yesterday = new Date(Date.now() - 86400000).toISOString();\n  \n  const activity = {\n    commits: await git.log({ since: yesterday }),\n    prs: await github.listPRs({ state: "all", since: yesterday }),\n    jiraUpdates: await jira.search(\n      `updated >= -1d AND assignee in (${teamMembers.join(",")})`\n    )\n  };\n\n  return await client.messages.create({\n    model: "claude-opus-4-6-20250414",\n    messages: [{\n      role: "user",\n      content: `Generate a standup summary from:\\n${JSON.stringify(activity)}\\n\\n` +\n        `Format as:\\n## Yesterday\\n## Today (inferred)\\n## Blockers`\n    }]\n  });\n}', language: 'typescript' }
            ]
          }
        ]
      }
    ];
  }
}
