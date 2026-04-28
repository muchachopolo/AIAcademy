import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';

interface PlaygroundMessage {
  role: 'user' | 'agent' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  thinking?: string;
  toolName?: string;
}

@Component({
  selector: 'app-playground',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="playground">
      <header class="playground-header">
        <h1>{{ i18n.t('playground.title') }}</h1>
        <p>{{ i18n.t('playground.subtitle') }}</p>
      </header>

      <div class="playground-layout">
        <div class="config-panel">
          <h3>{{ i18n.t('playground.config') }}</h3>

          <div class="config-group">
            <label>{{ i18n.t('playground.pattern') }}</label>
            <select [(ngModel)]="selectedPattern" (change)="resetSimulation()">
              <option value="single">{{ i18n.t('playground.pattern_single') }}</option>
              <option value="plan-execute">{{ i18n.t('playground.pattern_plan') }}</option>
              <option value="hierarchical">{{ i18n.t('playground.pattern_hierarchical') }}</option>
              <option value="react">{{ i18n.t('playground.pattern_react') }}</option>
            </select>
          </div>

          <div class="config-group">
            <label>{{ i18n.t('playground.tools') }}</label>
            <div class="tool-toggles">
              @for (tool of availableTools; track tool.name) {
                <label class="tool-toggle">
                  <input type="checkbox" [(ngModel)]="tool.enabled">
                  <span class="tool-name">{{ tool.icon }} {{ tool.name }}</span>
                </label>
              }
            </div>
          </div>

          <div class="config-group">
            <label>{{ i18n.t('playground.model') }}</label>
            <select [(ngModel)]="selectedModel">
              <option value="opus">{{ i18n.t('playground.model_opus') }}</option>
              <option value="sonnet">{{ i18n.t('playground.model_sonnet') }}</option>
              <option value="haiku">{{ i18n.t('playground.model_haiku') }}</option>
            </select>
          </div>

          <div class="config-group">
            <label>{{ i18n.t('playground.max_steps') }}</label>
            <input type="range" min="1" max="20" [(ngModel)]="maxSteps">
            <span class="range-value">{{ maxSteps }}</span>
          </div>
        </div>

        <div class="simulation-panel">
          <div class="chat-area">
            @for (msg of messages(); track $index) {
              <div class="message" [class]="'msg-' + msg.role">
                <div class="msg-header">
                  <span class="msg-role">
                    @switch (msg.role) {
                      @case ('user') { 👤 User }
                      @case ('agent') { 🤖 Agent }
                      @case ('system') { ⚙️ System }
                      @case ('tool') { 🔧 {{ msg.toolName }} }
                    }
                  </span>
                  <span class="msg-time">{{ msg.timestamp | date:'HH:mm:ss' }}</span>
                </div>
                @if (msg.thinking) {
                  <div class="msg-thinking">💭 {{ msg.thinking }}</div>
                }
                <div class="msg-content">{{ msg.content }}</div>
              </div>
            }
            @if (isRunning()) {
              <div class="message msg-agent typing">
                <span class="typing-indicator">
                  <span></span><span></span><span></span>
                </span>
              </div>
            }
          </div>

          <div class="input-area">
            <input
              type="text"
              [(ngModel)]="userInput"
              (keyup.enter)="sendMessage()"
              [placeholder]="i18n.t('playground.input_placeholder')"
              [disabled]="isRunning()"
            />
            <button (click)="sendMessage()" [disabled]="isRunning() || !userInput.trim()" class="send-btn">
              {{ isRunning() ? '⏳' : '▶' }} {{ i18n.t('playground.run') }}
            </button>
          </div>

          <div class="example-tasks">
            <span class="examples-label">{{ i18n.t('playground.try') }}</span>
            @for (example of exampleTasks; track example) {
              <button class="example-btn" (click)="userInput = example; sendMessage()">{{ example }}</button>
            }
          </div>
        </div>

        <div class="metrics-panel">
          <h3>{{ i18n.t('playground.metrics') }}</h3>
          <div class="metric">
            <span class="metric-label">{{ i18n.t('playground.steps') }}</span>
            <span class="metric-value">{{ stepCount() }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">{{ i18n.t('playground.tool_calls') }}</span>
            <span class="metric-value">{{ toolCallCount() }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">{{ i18n.t('playground.tokens') }}</span>
            <span class="metric-value">{{ estimatedTokens() }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">{{ i18n.t('playground.cost') }}</span>
            <span class="metric-value">\${{ estimatedCost() }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">{{ i18n.t('playground.pattern_label') }}</span>
            <span class="metric-value metric-pattern">{{ selectedPattern }}</span>
          </div>

          <h4>{{ i18n.t('playground.tool_usage') }}</h4>
          <div class="tool-usage">
            @for (tool of toolUsage(); track tool.name) {
              <div class="tool-stat">
                <span>{{ tool.name }}</span>
                <span class="tool-count">{{ tool.count }}x</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playground {
      max-width: 1400px;
      margin: 0 auto;
    }

    .playground-header {
      margin-bottom: 2rem;
      h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
      p { color: var(--text-secondary); font-size: 0.9rem; }
    }

    .playground-layout {
      display: grid;
      grid-template-columns: 250px 1fr 220px;
      gap: 1rem;
      height: calc(100vh - 200px);
    }

    .config-panel, .metrics-panel {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      overflow-y: auto;

      h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary); }
      h4 { font-size: 0.8rem; font-weight: 600; margin: 1rem 0 0.5rem; color: var(--text-muted); }
    }

    .config-group {
      margin-bottom: 1.25rem;

      label {
        display: block;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
      }

      select, input[type="range"] {
        width: 100%;
        padding: 0.5rem;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--text-primary);
        font-size: 0.85rem;
      }
    }

    .tool-toggles {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .tool-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-secondary);
      cursor: pointer;

      input { width: 14px; height: 14px; }
    }

    .range-value {
      font-size: 0.8rem;
      color: var(--accent);
      font-weight: 600;
    }

    .simulation-panel {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .chat-area {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .message {
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      animation: fadeIn 0.3s ease;

      &.msg-user { background: rgba(108, 92, 231, 0.1); border-left: 3px solid var(--primary); }
      &.msg-agent { background: var(--bg-surface); border-left: 3px solid var(--accent); }
      &.msg-system { background: rgba(253, 203, 110, 0.05); border-left: 3px solid var(--warning); }
      &.msg-tool { background: rgba(0, 206, 201, 0.05); border-left: 3px solid var(--accent-light); }
    }

    .msg-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .msg-role { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); }
    .msg-time { font-size: 0.7rem; color: var(--text-muted); }
    .msg-thinking { font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-bottom: 0.25rem; }
    .msg-content { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; white-space: pre-wrap; }

    .typing {
      padding: 1rem;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;

      span {
        width: 6px;
        height: 6px;
        background: var(--text-muted);
        border-radius: 50%;
        animation: bounce 1.4s infinite;

        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }

    .input-area {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      border-top: 1px solid var(--border);

      input {
        flex: 1;
        padding: 0.75rem 1rem;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--text-primary);
        font-size: 0.9rem;

        &::placeholder { color: var(--text-muted); }
        &:focus { outline: none; border-color: var(--primary); }
      }
    }

    .send-btn {
      padding: 0.75rem 1.25rem;
      background: var(--gradient-primary);
      border: none;
      border-radius: var(--radius-sm);
      color: white;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;

      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:hover:not(:disabled) { opacity: 0.9; }
    }

    .example-tasks {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--border);
      overflow-x: auto;
      flex-wrap: nowrap;
    }

    .examples-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .example-btn {
      padding: 0.35rem 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      color: var(--text-secondary);
      font-size: 0.75rem;
      cursor: pointer;
      white-space: nowrap;

      &:hover { border-color: var(--primary); color: var(--primary-light); }
    }

    .metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border);
    }

    .metric-label { font-size: 0.8rem; color: var(--text-muted); }
    .metric-value { font-size: 0.85rem; font-weight: 600; color: var(--accent); }
    .metric-pattern { font-size: 0.75rem; text-transform: capitalize; }

    .tool-stat {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      padding: 0.25rem 0;
      color: var(--text-secondary);
    }

    .tool-count { color: var(--primary-light); font-weight: 600; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }
  `]
})
export class PlaygroundComponent {
  selectedPattern = 'single';
  selectedModel = 'opus';
  maxSteps = 10;
  userInput = '';

  messages = signal<PlaygroundMessage[]>([]);
  isRunning = signal(false);
  stepCount = signal(0);
  toolCallCount = signal(0);
  estimatedTokens = signal(0);
  toolUsage = signal<{name: string; count: number}[]>([]);

  availableTools = [
    { name: 'Read File', icon: '📄', enabled: true },
    { name: 'Write File', icon: '✏️', enabled: true },
    { name: 'Run Shell', icon: '💻', enabled: true },
    { name: 'Search Code', icon: '🔍', enabled: true },
    { name: 'Jira', icon: '📋', enabled: false },
    { name: 'Git', icon: '🔀', enabled: true },
    { name: 'Database', icon: '🗄️', enabled: false },
    { name: 'HTTP Request', icon: '🌐', enabled: false },
  ];

  get exampleTasks(): string[] {
    return [
      this.i18n.t('playground.example_1'),
      this.i18n.t('playground.example_2'),
      this.i18n.t('playground.example_3'),
      this.i18n.t('playground.example_4'),
    ];
  }

  constructor(protected i18n: I18nService) {}

  estimatedCost(): string {
    const tokens = this.estimatedTokens();
    const cost = (tokens / 1000) * 0.015;
    return cost.toFixed(4);
  }

  resetSimulation() {
    this.messages.set([]);
    this.stepCount.set(0);
    this.toolCallCount.set(0);
    this.estimatedTokens.set(0);
    this.toolUsage.set([]);
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isRunning()) return;

    const task = this.userInput.trim();
    this.userInput = '';
    this.resetSimulation();

    this.messages.set([{
      role: 'user',
      content: task,
      timestamp: new Date()
    }]);

    this.isRunning.set(true);
    this.simulateAgent(task);
  }

  private simulateAgent(task: string) {
    const enabledTools = this.availableTools.filter(t => t.enabled).map(t => t.name);
    const steps = this.getSimulationSteps(task, this.selectedPattern, enabledTools);

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length && i < this.maxSteps) {
        const step = steps[i];
        this.messages.set([...this.messages(), step]);
        this.stepCount.set(this.stepCount() + 1);

        if (step.role === 'tool') {
          this.toolCallCount.set(this.toolCallCount() + 1);
          this.updateToolUsage(step.toolName || 'Unknown');
        }

        this.estimatedTokens.set(this.estimatedTokens() + Math.floor(Math.random() * 500 + 200));
        i++;
      } else {
        clearInterval(interval);
        this.isRunning.set(false);
        this.messages.set([...this.messages(), {
          role: 'system',
          content: `✅ Task completed in ${this.stepCount()} steps using ${this.toolCallCount()} tool calls (~${this.estimatedTokens()} tokens).`,
          timestamp: new Date()
        }]);
      }
    }, 1000);
  }

  private updateToolUsage(toolName: string) {
    const usage = [...this.toolUsage()];
    const existing = usage.find(t => t.name === toolName);
    if (existing) {
      existing.count++;
    } else {
      usage.push({ name: toolName, count: 1 });
    }
    this.toolUsage.set(usage);
  }

  private getSimulationSteps(task: string, pattern: string, tools: string[]): PlaygroundMessage[] {
    const now = () => new Date();

    if (pattern === 'hierarchical') {
      return [
        { role: 'agent', content: `I'll orchestrate multiple specialist agents to handle: "${task}"`, thinking: 'Breaking this into sub-tasks for parallel execution', timestamp: now() },
        { role: 'system', content: 'Orchestrator: Delegating to Planner Agent...', timestamp: now() },
        { role: 'agent', content: 'Planner Agent: Analyzing task complexity and dependencies. Creating execution plan with 4 steps.', thinking: 'Step 1: Read existing code. Step 2: Implement changes. Step 3: Test. Step 4: Create PR.', timestamp: now() },
        { role: 'tool', content: 'Found 3 relevant files: service.ts, controller.ts, types.ts', toolName: 'Search Code', timestamp: now() },
        { role: 'system', content: 'Orchestrator: Delegating to Coder Agent...', timestamp: now() },
        { role: 'tool', content: 'Reading service.ts (145 lines)', toolName: 'Read File', timestamp: now() },
        { role: 'agent', content: 'Coder Agent: Implementing the changes based on the plan. Modifying service.ts and adding new endpoint.', thinking: 'Following existing patterns in the codebase', timestamp: now() },
        { role: 'tool', content: 'File updated: service.ts (+32 lines)', toolName: 'Write File', timestamp: now() },
        { role: 'system', content: 'Orchestrator: Delegating to Test Agent...', timestamp: now() },
        { role: 'agent', content: 'Test Agent: Writing unit tests for the new functionality.', timestamp: now() },
        { role: 'tool', content: 'Running test suite... 14 tests passed ✓', toolName: 'Run Shell', timestamp: now() },
        { role: 'system', content: 'Orchestrator: All agents complete. Compiling results.', timestamp: now() },
        { role: 'agent', content: 'Task complete! Implementation done, tested, and ready for review.', timestamp: now() },
      ];
    }

    if (pattern === 'plan-execute') {
      return [
        { role: 'agent', content: `Planning phase: Analyzing "${task}"`, thinking: 'First, I need to create a detailed plan before executing', timestamp: now() },
        { role: 'agent', content: 'Plan created:\n1. Read relevant files\n2. Understand current implementation\n3. Make changes\n4. Verify with tests\n5. Commit', timestamp: now() },
        { role: 'system', content: 'Executing step 1/5: Read relevant files', timestamp: now() },
        { role: 'tool', content: 'Found files matching pattern: 4 results', toolName: 'Search Code', timestamp: now() },
        { role: 'tool', content: 'Read main.ts (89 lines), config.ts (23 lines)', toolName: 'Read File', timestamp: now() },
        { role: 'system', content: 'Executing step 2/5: Understand implementation', timestamp: now() },
        { role: 'agent', content: 'Analysis complete: The current implementation uses a synchronous pattern. I need to convert to async with proper error handling.', thinking: 'The bottleneck is in the data fetching layer', timestamp: now() },
        { role: 'system', content: 'Executing step 3/5: Make changes', timestamp: now() },
        { role: 'tool', content: 'Updated main.ts: added async/await pattern', toolName: 'Write File', timestamp: now() },
        { role: 'system', content: 'Executing step 4/5: Verify', timestamp: now() },
        { role: 'tool', content: 'npm test: 8 passed, 0 failed', toolName: 'Run Shell', timestamp: now() },
        { role: 'system', content: 'Executing step 5/5: Commit', timestamp: now() },
        { role: 'tool', content: 'Created commit: "feat: add async support"', toolName: 'Git', timestamp: now() },
        { role: 'agent', content: 'All steps executed successfully. Task complete!', timestamp: now() },
      ];
    }

    if (pattern === 'react') {
      return [
        { role: 'agent', content: `Thought: I need to understand what "${task}" requires. Let me look at the codebase.`, thinking: 'ReAct: Reason first, then act', timestamp: now() },
        { role: 'agent', content: 'Action: Search for relevant files', timestamp: now() },
        { role: 'tool', content: 'Found: src/services/auth.ts, src/middleware/auth.middleware.ts', toolName: 'Search Code', timestamp: now() },
        { role: 'agent', content: 'Observation: There are 2 auth-related files. Let me read them to understand the current state.', thinking: 'I see the auth logic is split across service and middleware', timestamp: now() },
        { role: 'tool', content: 'auth.ts: Contains login/logout logic (67 lines)', toolName: 'Read File', timestamp: now() },
        { role: 'agent', content: 'Thought: I can see the issue. The token validation doesn\'t handle expired tokens correctly. I need to add a refresh mechanism.', thinking: 'The bug is on line 34 - missing expiry check', timestamp: now() },
        { role: 'agent', content: 'Action: Fix the token validation and add refresh logic', timestamp: now() },
        { role: 'tool', content: 'auth.ts updated: added token refresh on expiry', toolName: 'Write File', timestamp: now() },
        { role: 'agent', content: 'Observation: Changes made. Let me verify they work.', timestamp: now() },
        { role: 'tool', content: 'All tests passing (12/12)', toolName: 'Run Shell', timestamp: now() },
        { role: 'agent', content: 'Thought: Tests pass. The fix is complete and verified.', timestamp: now() },
      ];
    }

    // Default: single agent
    return [
      { role: 'agent', content: `I'll handle "${task}" step by step.`, thinking: 'Let me analyze what needs to be done', timestamp: now() },
      { role: 'tool', content: 'Searching codebase for relevant files...', toolName: 'Search Code', timestamp: now() },
      { role: 'tool', content: 'Found 2 relevant files', toolName: 'Search Code', timestamp: now() },
      { role: 'tool', content: 'Reading file contents (94 lines)', toolName: 'Read File', timestamp: now() },
      { role: 'agent', content: 'I understand the current implementation. Making the necessary changes...', thinking: 'The change requires modifying the handler and adding a new utility function', timestamp: now() },
      { role: 'tool', content: 'File updated successfully', toolName: 'Write File', timestamp: now() },
      { role: 'tool', content: 'Running tests... All 9 tests passed ✓', toolName: 'Run Shell', timestamp: now() },
      { role: 'agent', content: 'Done! The task is complete. Changes have been made and verified.', timestamp: now() },
    ];
  }
}
