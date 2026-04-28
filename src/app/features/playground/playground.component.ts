import { Component, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';

type PlaygroundTab = 'explorer' | 'simulator' | 'builder';

interface PatternInfo {
  id: string;
  icon: string;
  steps: { label: string; description: string; icon: string }[];
  code: string;
  useCases: string[];
}

interface PlaygroundMessage {
  role: 'user' | 'agent' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  thinking?: string;
  toolName?: string;
  coachNote?: string;
  patternTag?: string;
}

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'agent' | 'tool' | 'condition' | 'output';
  label: string;
  icon: string;
  x: number;
  y: number;
  config?: Record<string, string>;
}

interface WorkflowConnection {
  from: string;
  to: string;
  label?: string;
}

@Component({
  selector: 'app-playground',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="playground">
      <!-- Header -->
      <header class="playground-header">
        <div class="header-content">
          <div class="header-badge">{{ i18n.t('playground.badge') }}</div>
          <h1>{{ i18n.t('playground.title') }}</h1>
          <p class="header-desc">{{ i18n.t('playground.subtitle') }}</p>
        </div>
      </header>

      <!-- Tab Navigation -->
      <nav class="tab-nav">
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'explorer'"
          (click)="activeTab.set('explorer')">
          <span class="tab-icon">&#x1F50D;</span>
          <span class="tab-label">{{ i18n.t('playground.tab_explorer') }}</span>
          <span class="tab-hint">{{ i18n.t('playground.tab_explorer_hint') }}</span>
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'simulator'"
          (click)="activeTab.set('simulator')">
          <span class="tab-icon">&#x1F916;</span>
          <span class="tab-label">{{ i18n.t('playground.tab_simulator') }}</span>
          <span class="tab-hint">{{ i18n.t('playground.tab_simulator_hint') }}</span>
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'builder'"
          (click)="activeTab.set('builder')">
          <span class="tab-icon">&#x1F3D7;</span>
          <span class="tab-label">{{ i18n.t('playground.tab_builder') }}</span>
          <span class="tab-hint">{{ i18n.t('playground.tab_builder_hint') }}</span>
        </button>
      </nav>

      <!-- ========================== -->
      <!-- TAB 1: PATTERN EXPLORER    -->
      <!-- ========================== -->
      @if (activeTab() === 'explorer') {
        <div class="tab-intro">
          <span class="intro-icon">&#x1F4A1;</span>
          <p>{{ i18n.t('playground.explorer_intro') }}</p>
        </div>

        <div class="explorer-layout">
          <!-- Pattern Selector -->
          <div class="pattern-selector">
            <h3>{{ i18n.t('playground.select_pattern') }}</h3>
            @for (p of patterns; track p.id) {
              <button
                class="pattern-card"
                [class.selected]="selectedExplorerPattern() === p.id"
                (click)="selectExplorerPattern(p.id)">
                <span class="pattern-card-icon">{{ p.icon }}</span>
                <span class="pattern-card-label">{{ i18n.t('playground.pattern_' + p.id) }}</span>
              </button>
            }
          </div>

          <!-- Pattern Visualization -->
          <div class="pattern-viz">
            <div class="viz-header">
              <h2>{{ currentPattern().icon }} {{ i18n.t('playground.pattern_' + currentPattern().id) }}</h2>
              <p class="viz-desc">{{ i18n.t('playground.pattern_desc_' + currentPattern().id) }}</p>
            </div>

            <!-- Animated Diagram -->
            <div class="viz-diagram">
              <div class="diagram-flow">
                @for (step of currentPattern().steps; track step.label; let idx = $index) {
                  <div class="diagram-step" [class.active]="activeStep() === idx"
                       [style.animation-delay]="(idx * 0.15) + 's'">
                    <div class="step-icon">{{ step.icon }}</div>
                    <div class="step-label">{{ i18n.t('playground.' + step.label) }}</div>
                    <div class="step-desc">{{ i18n.t('playground.' + step.description) }}</div>
                  </div>
                  @if (idx < currentPattern().steps.length - 1) {
                    <div class="diagram-arrow" [style.animation-delay]="(idx * 0.15 + 0.07) + 's'">
                      <svg width="40" height="24" viewBox="0 0 40 24">
                        <path d="M2 12 L30 12 M24 6 L30 12 L24 18" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round"/>
                      </svg>
                    </div>
                  }
                }
              </div>
              <button class="replay-btn" (click)="replayAnimation()">{{ i18n.t('playground.replay') }}</button>
            </div>

            <!-- Use Cases -->
            <div class="viz-usecases">
              <h4>{{ i18n.t('playground.when_to_use') }}</h4>
              <ul>
                @for (uc of currentPattern().useCases; track uc) {
                  <li>{{ i18n.t('playground.' + uc) }}</li>
                }
              </ul>
            </div>

            <!-- Code Example -->
            <div class="viz-code">
              <div class="code-header">
                <span>{{ i18n.t('playground.code_example') }}</span>
                <button class="copy-btn" (click)="copyCode(currentPattern().code)">
                  {{ codeCopied() ? i18n.t('playground.copied') : i18n.t('playground.copy') }}
                </button>
              </div>
              <pre class="code-block"><code>{{ currentPattern().code }}</code></pre>
            </div>
          </div>
        </div>
      }

      <!-- ========================== -->
      <!-- TAB 2: AGENT SIMULATOR     -->
      <!-- ========================== -->
      @if (activeTab() === 'simulator') {
        <div class="tab-intro">
          <span class="intro-icon">&#x1F393;</span>
          <p>{{ i18n.t('playground.simulator_intro') }}</p>
        </div>

        <div class="simulator-layout">
          <!-- Config Panel -->
          <div class="config-panel">
            <h3>{{ i18n.t('playground.config') }}</h3>

            <!-- Guided Mode Toggle -->
            <div class="guided-toggle">
              <label class="toggle-switch">
                <input type="checkbox" [(ngModel)]="guidedMode">
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">{{ i18n.t('playground.guided_mode') }}</span>
              <span class="guided-badge">{{ i18n.t('playground.recommended') }}</span>
            </div>

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
              <label>{{ i18n.t('playground.speed') }}</label>
              <div class="speed-btns">
                <button [class.active]="simSpeed === 2000" (click)="simSpeed = 2000">0.5x</button>
                <button [class.active]="simSpeed === 1000" (click)="simSpeed = 1000">1x</button>
                <button [class.active]="simSpeed === 500" (click)="simSpeed = 500">2x</button>
              </div>
            </div>
          </div>

          <!-- Simulation Panel -->
          <div class="simulation-panel">
            <div class="chat-area">
              @if (messages().length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">&#x1F680;</div>
                  <h3>{{ i18n.t('playground.empty_title') }}</h3>
                  <p>{{ i18n.t('playground.empty_desc') }}</p>
                </div>
              }
              @for (msg of messages(); track $index) {
                <div class="message" [class]="'msg-' + msg.role">
                  <div class="msg-header">
                    <span class="msg-role">
                      @switch (msg.role) {
                        @case ('user') { &#x1F464; {{ i18n.t('playground.role_user') }} }
                        @case ('agent') { &#x1F916; {{ i18n.t('playground.role_agent') }} }
                        @case ('system') { &#x2699;&#xFE0F; {{ i18n.t('playground.role_system') }} }
                        @case ('tool') { &#x1F527; {{ msg.toolName }} }
                      }
                    </span>
                    @if (msg.patternTag) {
                      <span class="pattern-tag">{{ msg.patternTag }}</span>
                    }
                    <span class="msg-time">{{ msg.timestamp | date:'HH:mm:ss' }}</span>
                  </div>
                  @if (msg.thinking) {
                    <div class="msg-thinking">
                      <span class="thinking-label">{{ i18n.t('playground.thinking') }}</span>
                      {{ msg.thinking }}
                    </div>
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
                {{ isRunning() ? '...' : '>' }} {{ i18n.t('playground.run') }}
              </button>
            </div>

            <div class="example-tasks">
              <span class="examples-label">{{ i18n.t('playground.try') }}</span>
              @for (example of exampleTasks; track example) {
                <button class="example-btn" (click)="userInput = example; sendMessage()">{{ example }}</button>
              }
            </div>
          </div>

          <!-- Coach / Metrics Panel -->
          <div class="coach-panel">
            @if (guidedMode) {
              <div class="coach-section">
                <h3>&#x1F9D1;&#x200D;&#x1F3EB; {{ i18n.t('playground.coach') }}</h3>
                <div class="coach-messages">
                  @if (coachMessages().length === 0) {
                    <div class="coach-empty">
                      <p>{{ i18n.t('playground.coach_waiting') }}</p>
                    </div>
                  }
                  @for (note of coachMessages(); track $index) {
                    <div class="coach-note" [style.animation-delay]="($index * 0.1) + 's'">
                      <div class="coach-note-content">{{ note }}</div>
                    </div>
                  }
                </div>
              </div>
            }

            <div class="metrics-section">
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
                <span class="metric-value metric-pattern">{{ i18n.t('playground.pattern_' + selectedPattern) }}</span>
              </div>

              @if (toolUsage().length > 0) {
                <h4>{{ i18n.t('playground.tool_usage') }}</h4>
                <div class="tool-usage">
                  @for (tool of toolUsage(); track tool.name) {
                    <div class="tool-stat">
                      <span>{{ tool.name }}</span>
                      <div class="tool-bar-wrap">
                        <div class="tool-bar" [style.width]="(tool.count / maxToolCount()) * 100 + '%'"></div>
                      </div>
                      <span class="tool-count">{{ tool.count }}x</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- ========================== -->
      <!-- TAB 3: BUILD YOUR OWN      -->
      <!-- ========================== -->
      @if (activeTab() === 'builder') {
        <div class="tab-intro">
          <span class="intro-icon">&#x1F528;</span>
          <p>{{ i18n.t('playground.builder_intro') }}</p>
        </div>

        <div class="builder-layout">
          <!-- Palette -->
          <div class="builder-palette">
            <h3>{{ i18n.t('playground.components') }}</h3>
            <p class="palette-hint">{{ i18n.t('playground.palette_hint') }}</p>
            @for (item of paletteItems; track item.type) {
              <button class="palette-item" (click)="addNodeToWorkflow(item.type, item.label, item.icon)">
                <span class="palette-icon">{{ item.icon }}</span>
                <div class="palette-info">
                  <span class="palette-name">{{ i18n.t('playground.node_' + item.type) }}</span>
                  <span class="palette-desc">{{ i18n.t('playground.node_desc_' + item.type) }}</span>
                </div>
              </button>
            }
          </div>

          <!-- Canvas -->
          <div class="builder-canvas">
            <div class="canvas-toolbar">
              <span class="canvas-title">{{ i18n.t('playground.workflow_canvas') }}</span>
              <button class="toolbar-btn" (click)="clearWorkflow()">{{ i18n.t('playground.clear') }}</button>
              <button class="toolbar-btn primary" (click)="generateWorkflowCode()">{{ i18n.t('playground.generate_code') }}</button>
            </div>

            <div class="canvas-area">
              @if (workflowNodes().length === 0) {
                <div class="canvas-empty">
                  <div class="canvas-empty-icon">&#x1F3AF;</div>
                  <p>{{ i18n.t('playground.canvas_empty') }}</p>
                  <p class="canvas-empty-hint">{{ i18n.t('playground.canvas_empty_hint') }}</p>
                </div>
              }

              <div class="workflow-chain">
                @for (node of workflowNodes(); track node.id; let idx = $index) {
                  <div class="workflow-node" [class]="'node-' + node.type"
                       [class.selected]="selectedNodeId() === node.id"
                       (click)="selectNode(node.id)">
                    <div class="node-header">
                      <span class="node-icon">{{ node.icon }}</span>
                      <span class="node-label">{{ i18n.t('playground.node_' + node.type) }}</span>
                      <button class="node-remove" (click)="removeNode(node.id); $event.stopPropagation()">x</button>
                    </div>
                    @if (node.config) {
                      <div class="node-config">
                        @for (entry of getNodeConfigEntries(node); track entry[0]) {
                          <span class="config-tag">{{ entry[0] }}: {{ entry[1] }}</span>
                        }
                      </div>
                    }
                  </div>
                  @if (idx < workflowNodes().length - 1) {
                    <div class="chain-connector">
                      <svg width="32" height="40" viewBox="0 0 32 40">
                        <path d="M16 2 L16 30 M10 24 L16 30 L22 24" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round"/>
                      </svg>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Node Config Panel -->
            @if (selectedNodeId() && getSelectedNode()) {
              <div class="node-config-panel">
                <h4>{{ i18n.t('playground.configure_node') }}</h4>
                <div class="config-field">
                  <label>{{ i18n.t('playground.node_name') }}</label>
                  <input type="text" [ngModel]="getSelectedNode()!.label"
                         (ngModelChange)="updateNodeLabel($event)"/>
                </div>
                @if (getSelectedNode()!.type === 'agent') {
                  <div class="config-field">
                    <label>{{ i18n.t('playground.agent_model') }}</label>
                    <select [ngModel]="getSelectedNode()!.config?.['model'] ?? 'opus'"
                            (ngModelChange)="updateNodeConfig('model', $event)">
                      <option value="opus">Claude Opus 4</option>
                      <option value="sonnet">Claude Sonnet 4</option>
                      <option value="haiku">Claude Haiku 4</option>
                    </select>
                  </div>
                  <div class="config-field">
                    <label>{{ i18n.t('playground.agent_role') }}</label>
                    <select [ngModel]="getSelectedNode()!.config?.['role'] ?? 'general'"
                            (ngModelChange)="updateNodeConfig('role', $event)">
                      <option value="general">{{ i18n.t('playground.role_general') }}</option>
                      <option value="planner">{{ i18n.t('playground.role_planner') }}</option>
                      <option value="coder">{{ i18n.t('playground.role_coder') }}</option>
                      <option value="reviewer">{{ i18n.t('playground.role_reviewer') }}</option>
                      <option value="tester">{{ i18n.t('playground.role_tester') }}</option>
                    </select>
                  </div>
                }
                @if (getSelectedNode()!.type === 'tool') {
                  <div class="config-field">
                    <label>{{ i18n.t('playground.tool_type') }}</label>
                    <select [ngModel]="getSelectedNode()!.config?.['toolType'] ?? 'read'"
                            (ngModelChange)="updateNodeConfig('toolType', $event)">
                      <option value="read">Read File</option>
                      <option value="write">Write File</option>
                      <option value="shell">Run Shell</option>
                      <option value="search">Search Code</option>
                      <option value="git">Git</option>
                      <option value="http">HTTP Request</option>
                    </select>
                  </div>
                }
                @if (getSelectedNode()!.type === 'condition') {
                  <div class="config-field">
                    <label>{{ i18n.t('playground.condition_expr') }}</label>
                    <input type="text" [ngModel]="getSelectedNode()!.config?.['expression'] ?? ''"
                           (ngModelChange)="updateNodeConfig('expression', $event)"
                           placeholder="result.success === true"/>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Generated Code -->
          <div class="builder-output">
            <h3>{{ i18n.t('playground.generated_code') }}</h3>
            @if (generatedCode()) {
              <div class="code-header">
                <span>TypeScript</span>
                <button class="copy-btn" (click)="copyCode(generatedCode())">
                  {{ codeCopied() ? i18n.t('playground.copied') : i18n.t('playground.copy') }}
                </button>
              </div>
              <pre class="code-block"><code>{{ generatedCode() }}</code></pre>
            } @else {
              <div class="output-empty">
                <p>{{ i18n.t('playground.output_empty') }}</p>
              </div>
            }

            <!-- Pattern Detection -->
            @if (detectedPattern()) {
              <div class="pattern-detection">
                <h4>{{ i18n.t('playground.detected_pattern') }}</h4>
                <div class="detected-badge">{{ detectedPattern() }}</div>
                <p class="detected-desc">{{ i18n.t('playground.detected_desc_' + detectedPattern()) }}</p>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ================ GLOBAL ================ */
    .playground {
      max-width: 1500px;
      margin: 0 auto;
      min-height: calc(100vh - 120px);
    }

    /* ================ HEADER ================ */
    .playground-header {
      margin-bottom: 1.5rem;
      padding: 2rem 2rem 1.5rem;
      background: linear-gradient(135deg, rgba(108, 92, 231, 0.12) 0%, rgba(0, 206, 201, 0.08) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      position: relative;
      overflow: hidden;
    }

    .playground-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(108, 92, 231, 0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    .header-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: var(--gradient-primary);
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: white;
      margin-bottom: 0.75rem;
    }

    .playground-header h1 {
      font-size: 1.6rem;
      font-weight: 800;
      margin-bottom: 0.35rem;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .header-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
      max-width: 700px;
    }

    /* ================ TAB NAV ================ */
    .tab-nav {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      padding: 0.35rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
    }

    .tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.85rem 1.25rem;
      background: transparent;
      border: 2px solid transparent;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
    }

    .tab-btn:hover {
      background: var(--bg-surface);
      color: var(--text-primary);
    }

    .tab-btn.active {
      background: var(--bg-surface);
      border-color: var(--primary);
      color: var(--text-primary);
      box-shadow: 0 0 20px rgba(108, 92, 231, 0.1);
    }

    .tab-icon { font-size: 1.2rem; }

    .tab-label {
      font-weight: 600;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .tab-hint {
      font-size: 0.72rem;
      color: var(--text-muted);
      display: none;
    }

    .tab-btn.active .tab-hint { display: inline; }

    /* ================ TAB INTRO ================ */
    .tab-intro {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      margin-bottom: 1.25rem;
      background: rgba(108, 92, 231, 0.06);
      border: 1px solid rgba(108, 92, 231, 0.15);
      border-radius: var(--radius-sm);
      animation: fadeSlideDown 0.4s ease;
    }

    .intro-icon { font-size: 1.4rem; flex-shrink: 0; }

    .tab-intro p {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    /* ======================= */
    /* PATTERN EXPLORER STYLES */
    /* ======================= */
    .explorer-layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 1rem;
      animation: fadeIn 0.35s ease;
    }

    .pattern-selector {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
    }

    .pattern-selector h3 {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .pattern-card {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      width: 100%;
      padding: 0.8rem;
      margin-bottom: 0.5rem;
      background: var(--bg-surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .pattern-card:hover {
      border-color: var(--primary);
      color: var(--text-primary);
    }

    .pattern-card.selected {
      border-color: var(--primary);
      background: rgba(108, 92, 231, 0.1);
      color: var(--text-primary);
      box-shadow: 0 0 16px rgba(108, 92, 231, 0.1);
    }

    .pattern-card-icon { font-size: 1.2rem; }
    .pattern-card-label { font-size: 0.82rem; font-weight: 500; }

    .pattern-viz {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      overflow-y: auto;
      max-height: calc(100vh - 320px);
    }

    .viz-header h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }

    .viz-desc {
      color: var(--text-secondary);
      font-size: 0.88rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    /* Diagram */
    .viz-diagram {
      padding: 1.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 1.5rem;
      position: relative;
    }

    .diagram-flow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding: 1rem 0;
    }

    .diagram-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      padding: 1rem 0.75rem;
      min-width: 110px;
      max-width: 140px;
      background: var(--bg-card);
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      text-align: center;
      opacity: 0;
      animation: stepAppear 0.5s ease forwards;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .diagram-step.active {
      border-color: var(--primary);
      box-shadow: 0 0 20px rgba(108, 92, 231, 0.2);
    }

    .step-icon { font-size: 1.4rem; }
    .step-label { font-size: 0.78rem; font-weight: 600; color: var(--text-primary); }
    .step-desc { font-size: 0.68rem; color: var(--text-muted); line-height: 1.3; }

    .diagram-arrow {
      opacity: 0;
      animation: stepAppear 0.5s ease forwards;
      flex-shrink: 0;
    }

    .replay-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.3rem 0.7rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 0.72rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .replay-btn:hover { border-color: var(--primary); color: var(--primary-light); }

    /* Use Cases */
    .viz-usecases {
      margin-bottom: 1.5rem;
    }

    .viz-usecases h4 {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.6rem;
    }

    .viz-usecases ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .viz-usecases li {
      font-size: 0.82rem;
      color: var(--text-secondary);
      padding: 0.4rem 0.6rem;
      background: var(--bg-surface);
      border-radius: var(--radius-sm);
      border-left: 3px solid var(--accent);
    }

    /* Code Block */
    .viz-code, .builder-output .code-block {
      position: relative;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 1rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
      border: 1px solid var(--border);
      border-bottom: none;
    }

    .code-header span {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .copy-btn {
      padding: 0.25rem 0.6rem;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 0.72rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .copy-btn:hover { border-color: var(--primary); color: var(--primary-light); }

    .code-block {
      margin: 0;
      padding: 1.25rem;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border);
      border-radius: 0 0 var(--radius-sm) var(--radius-sm);
      overflow-x: auto;
      font-size: 0.8rem;
      line-height: 1.6;
      color: var(--text-secondary);
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    }

    /* ========================= */
    /* AGENT SIMULATOR STYLES    */
    /* ========================= */
    .simulator-layout {
      display: grid;
      grid-template-columns: 240px 1fr 260px;
      gap: 1rem;
      height: calc(100vh - 300px);
      min-height: 500px;
      animation: fadeIn 0.35s ease;
    }

    .config-panel, .coach-panel {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      overflow-y: auto;
    }

    .config-panel h3, .coach-panel h3, .metrics-section h3 {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .config-panel h4, .coach-panel h4, .metrics-section h4 {
      font-size: 0.8rem;
      font-weight: 600;
      margin: 1rem 0 0.5rem;
      color: var(--text-muted);
    }

    /* Guided Mode Toggle */
    .guided-toggle {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem;
      margin-bottom: 1.25rem;
      background: rgba(0, 206, 201, 0.06);
      border: 1px solid rgba(0, 206, 201, 0.15);
      border-radius: var(--radius-sm);
    }

    .toggle-switch {
      position: relative;
      width: 36px;
      height: 20px;
      flex-shrink: 0;

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      transition: 0.3s;
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      height: 14px;
      width: 14px;
      left: 2px;
      bottom: 2px;
      background: var(--text-muted);
      border-radius: 50%;
      transition: 0.3s;
    }

    .toggle-switch input:checked + .toggle-slider {
      background: var(--accent);
      border-color: var(--accent);
    }

    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(16px);
      background: white;
    }

    .toggle-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .guided-badge {
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--accent);
      background: rgba(0, 206, 201, 0.1);
      padding: 0.15rem 0.4rem;
      border-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
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

      input { width: 14px; height: 14px; accent-color: var(--primary); }
    }

    .speed-btns {
      display: flex;
      gap: 0.35rem;

      button {
        flex: 1;
        padding: 0.4rem;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--text-muted);
        font-size: 0.78rem;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          border-color: var(--primary);
          color: var(--primary-light);
          background: rgba(108, 92, 231, 0.1);
        }

        &:hover { border-color: var(--primary); }
      }
    }

    /* Simulation Panel */
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

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0.5rem;
      color: var(--text-muted);
    }

    .empty-icon { font-size: 2.5rem; opacity: 0.5; margin-bottom: 0.5rem; }
    .empty-state h3 { font-size: 1rem; font-weight: 600; color: var(--text-secondary); }
    .empty-state p { font-size: 0.82rem; max-width: 320px; line-height: 1.5; }

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
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .msg-role { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); }
    .msg-time { font-size: 0.7rem; color: var(--text-muted); margin-left: auto; }

    .pattern-tag {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.1rem 0.45rem;
      background: rgba(108, 92, 231, 0.12);
      color: var(--primary-light);
      border-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .msg-thinking {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-style: italic;
      margin-bottom: 0.35rem;
      padding: 0.4rem 0.6rem;
      background: rgba(0, 0, 0, 0.15);
      border-radius: var(--radius-sm);
      border-left: 2px solid var(--accent);
    }

    .thinking-label {
      font-weight: 600;
      font-style: normal;
      color: var(--accent);
      margin-right: 0.4rem;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .msg-content { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap; }

    .typing { padding: 1rem; }

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
      transition: opacity 0.2s;

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
      transition: all 0.2s;

      &:hover { border-color: var(--primary); color: var(--primary-light); }
    }

    /* Coach Panel */
    .coach-section {
      margin-bottom: 1.5rem;
    }

    .coach-messages {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .coach-empty p {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .coach-note {
      padding: 0.65rem 0.8rem;
      background: rgba(0, 206, 201, 0.06);
      border: 1px solid rgba(0, 206, 201, 0.12);
      border-radius: var(--radius-sm);
      animation: fadeSlideDown 0.4s ease forwards;
      opacity: 0;
    }

    .coach-note-content {
      font-size: 0.8rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    /* Metrics */
    .metrics-section { margin-top: 0.5rem; }

    .metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border);
    }

    .metric-label { font-size: 0.8rem; color: var(--text-muted); }
    .metric-value { font-size: 0.85rem; font-weight: 600; color: var(--accent); }
    .metric-pattern { font-size: 0.72rem; }

    .tool-stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      padding: 0.3rem 0;
      color: var(--text-secondary);
    }

    .tool-bar-wrap {
      flex: 1;
      height: 4px;
      background: var(--bg-surface);
      border-radius: 2px;
      overflow: hidden;
    }

    .tool-bar {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    .tool-count { color: var(--primary-light); font-weight: 600; font-size: 0.75rem; min-width: 24px; text-align: right; }

    /* ========================= */
    /* BUILD YOUR OWN STYLES     */
    /* ========================= */
    .builder-layout {
      display: grid;
      grid-template-columns: 200px 1fr 280px;
      gap: 1rem;
      height: calc(100vh - 300px);
      min-height: 500px;
      animation: fadeIn 0.35s ease;
    }

    .builder-palette {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      overflow-y: auto;
    }

    .builder-palette h3 {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .palette-hint {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    .palette-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      width: 100%;
      padding: 0.65rem 0.7rem;
      margin-bottom: 0.4rem;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .palette-item:hover {
      border-color: var(--primary);
      background: rgba(108, 92, 231, 0.06);
      transform: translateX(2px);
    }

    .palette-icon { font-size: 1.1rem; }
    .palette-info { display: flex; flex-direction: column; gap: 0.1rem; }
    .palette-name { font-size: 0.78rem; font-weight: 600; color: var(--text-primary); }
    .palette-desc { font-size: 0.65rem; color: var(--text-muted); }

    /* Canvas */
    .builder-canvas {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .canvas-toolbar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
    }

    .canvas-title {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-right: auto;
    }

    .toolbar-btn {
      padding: 0.35rem 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { border-color: var(--primary); color: var(--primary-light); }

      &.primary {
        background: var(--gradient-primary);
        border-color: transparent;
        color: white;
        font-weight: 600;

        &:hover { opacity: 0.9; }
      }
    }

    .canvas-area {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .canvas-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0.5rem;
    }

    .canvas-empty-icon { font-size: 2.5rem; opacity: 0.4; }
    .canvas-empty p { font-size: 0.85rem; color: var(--text-muted); }
    .canvas-empty-hint { font-size: 0.75rem; }

    .workflow-chain {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      width: 100%;
      max-width: 320px;
    }

    .chain-connector {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
    }

    .workflow-node {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.25s ease;
      animation: fadeSlideDown 0.35s ease;

      &:hover { border-color: var(--primary); }

      &.selected {
        border-color: var(--primary);
        box-shadow: 0 0 20px rgba(108, 92, 231, 0.15);
      }

      &.node-trigger { border-left: 4px solid #fdcb6e; }
      &.node-agent { border-left: 4px solid var(--primary); }
      &.node-tool { border-left: 4px solid var(--accent); }
      &.node-condition { border-left: 4px solid #e17055; }
      &.node-output { border-left: 4px solid #00b894; }
    }

    .node-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .node-icon { font-size: 1rem; }
    .node-label { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); flex: 1; }

    .node-remove {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 50%;
      color: var(--text-muted);
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { border-color: #e17055; color: #e17055; background: rgba(225, 112, 85, 0.1); }
    }

    .node-config {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      margin-top: 0.4rem;
    }

    .config-tag {
      font-size: 0.65rem;
      padding: 0.15rem 0.4rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      color: var(--text-muted);
    }

    .node-config-panel {
      padding: 1rem;
      border-top: 1px solid var(--border);
      background: var(--bg-surface);
    }

    .node-config-panel h4 {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .config-field {
      margin-bottom: 0.75rem;

      label {
        display: block;
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-bottom: 0.3rem;
        font-weight: 500;
      }

      input, select {
        width: 100%;
        padding: 0.45rem 0.6rem;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--text-primary);
        font-size: 0.82rem;

        &:focus { outline: none; border-color: var(--primary); }
      }
    }

    /* Builder Output */
    .builder-output {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .builder-output h3 {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .output-empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .output-empty p {
      font-size: 0.82rem;
      color: var(--text-muted);
      text-align: center;
    }

    .pattern-detection {
      margin-top: 1.25rem;
      padding: 1rem;
      background: rgba(108, 92, 231, 0.06);
      border: 1px solid rgba(108, 92, 231, 0.15);
      border-radius: var(--radius-sm);
    }

    .pattern-detection h4 {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .detected-badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      background: var(--gradient-primary);
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.5rem;
    }

    .detected-desc {
      font-size: 0.78rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    /* ================ ANIMATIONS ================ */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeSlideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes stepAppear {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `]
})
export class PlaygroundComponent {
  // ---- General State ----
  activeTab = signal<PlaygroundTab>('explorer');
  codeCopied = signal(false);

  // ---- Pattern Explorer State ----
  selectedExplorerPattern = signal('single');
  activeStep = signal(-1);
  private animationTimer: any = null;

  // ---- Simulator State ----
  selectedPattern = 'single';
  selectedModel = 'opus';
  userInput = '';
  guidedMode = true;
  simSpeed = 1000;

  messages = signal<PlaygroundMessage[]>([]);
  coachMessages = signal<string[]>([]);
  isRunning = signal(false);
  stepCount = signal(0);
  toolCallCount = signal(0);
  estimatedTokens = signal(0);
  toolUsage = signal<{ name: string; count: number }[]>([]);
  maxToolCount = computed(() => Math.max(1, ...this.toolUsage().map(t => t.count)));

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

  // ---- Builder State ----
  workflowNodes = signal<WorkflowNode[]>([]);
  selectedNodeId = signal<string | null>(null);
  generatedCode = signal('');
  detectedPattern = signal('');
  private nodeCounter = 0;

  paletteItems = [
    { type: 'trigger', label: 'Trigger', icon: '⚡' },
    { type: 'agent', label: 'Agent', icon: '🤖' },
    { type: 'tool', label: 'Tool', icon: '🔧' },
    { type: 'condition', label: 'Condition', icon: '🔀' },
    { type: 'output', label: 'Output', icon: '📤' },
  ];

  // ---- Pattern Data ----
  patterns: PatternInfo[] = [
    {
      id: 'single',
      icon: '🤖',
      steps: [
        { label: 'step_receive', description: 'step_receive_desc', icon: '📥' },
        { label: 'step_reason', description: 'step_reason_desc', icon: '🧠' },
        { label: 'step_tool', description: 'step_tool_desc', icon: '🔧' },
        { label: 'step_respond', description: 'step_respond_desc', icon: '📤' },
      ],
      useCases: ['usecase_single_1', 'usecase_single_2', 'usecase_single_3'],
      code: `// Single Agent Pattern
const agent = new Agent({
  model: "claude-opus-4",
  tools: [readFile, writeFile, runShell],
  systemPrompt: \`You are a coding assistant.
    Analyze the task, use tools as needed,
    and provide a complete solution.\`
});

// The agent handles everything in a single loop
const result = await agent.run(
  "Fix the authentication bug in auth.ts"
);
// Agent internally: reason → act → observe → repeat`
    },
    {
      id: 'plan-execute',
      icon: '📋',
      steps: [
        { label: 'step_plan', description: 'step_plan_desc', icon: '📋' },
        { label: 'step_decompose', description: 'step_decompose_desc', icon: '🔢' },
        { label: 'step_execute', description: 'step_execute_desc', icon: '⚡' },
        { label: 'step_validate', description: 'step_validate_desc', icon: '✅' },
        { label: 'step_adapt', description: 'step_adapt_desc', icon: '🔄' },
      ],
      useCases: ['usecase_plan_1', 'usecase_plan_2', 'usecase_plan_3'],
      code: `// Plan & Execute Pattern
const planner = new Agent({
  model: "claude-opus-4",
  systemPrompt: "Create detailed execution plans."
});

const executor = new Agent({
  model: "claude-sonnet-4",
  tools: [readFile, writeFile, runShell, git]
});

// Phase 1: Create plan
const plan = await planner.run(
  "Plan how to add pagination to the users API"
);

// Phase 2: Execute each step
for (const step of plan.steps) {
  const result = await executor.run(step.instruction);

  // Phase 3: Validate & adapt
  if (!result.success) {
    const revisedPlan = await planner.run(
      \`Step failed: \${result.error}. Revise plan.\`
    );
  }
}`
    },
    {
      id: 'hierarchical',
      icon: '🏢',
      steps: [
        { label: 'step_orchestrate', description: 'step_orchestrate_desc', icon: '👔' },
        { label: 'step_delegate', description: 'step_delegate_desc', icon: '📨' },
        { label: 'step_specialist', description: 'step_specialist_desc', icon: '👩‍💻' },
        { label: 'step_aggregate', description: 'step_aggregate_desc', icon: '🔗' },
      ],
      useCases: ['usecase_hier_1', 'usecase_hier_2', 'usecase_hier_3'],
      code: `// Hierarchical Multi-Agent Pattern
const orchestrator = new Agent({
  model: "claude-opus-4",
  systemPrompt: "You coordinate specialist agents."
});

const agents = {
  planner: new Agent({ role: "planner", model: "opus" }),
  coder:   new Agent({ role: "coder",   model: "sonnet",
                        tools: [readFile, writeFile] }),
  tester:  new Agent({ role: "tester",  model: "sonnet",
                        tools: [runShell] }),
  reviewer: new Agent({ role: "reviewer", model: "opus" })
};

// Orchestrator delegates to specialists
const task = "Build a user registration feature";
const plan = await orchestrator.delegate(
  agents.planner, task
);
const code = await orchestrator.delegate(
  agents.coder, plan
);
const tests = await orchestrator.delegate(
  agents.tester, code
);
const review = await orchestrator.delegate(
  agents.reviewer, { code, tests }
);`
    },
    {
      id: 'react',
      icon: '🔄',
      steps: [
        { label: 'step_thought', description: 'step_thought_desc', icon: '💭' },
        { label: 'step_action', description: 'step_action_desc', icon: '⚡' },
        { label: 'step_observation', description: 'step_observation_desc', icon: '👁️' },
        { label: 'step_loop', description: 'step_loop_desc', icon: '🔄' },
      ],
      useCases: ['usecase_react_1', 'usecase_react_2', 'usecase_react_3'],
      code: `// ReAct (Reasoning + Acting) Pattern
const agent = new Agent({
  model: "claude-opus-4",
  tools: [readFile, writeFile, search, runShell],
  systemPrompt: \`For each step, follow this format:
    Thought: reason about what to do next
    Action: choose and use a tool
    Observation: analyze the tool's output
    ... repeat until task is complete
    Final Answer: summarize the result\`
});

// The agent explicitly shows its reasoning
const result = await agent.run(
  "Find and fix the memory leak in the app"
);

// Trace output:
// Thought: I need to find memory-heavy operations...
// Action: search("memory|heap|allocation")
// Observation: Found 3 files with potential issues
// Thought: Let me examine the cache in data.ts...
// Action: readFile("src/data.ts")
// Observation: The cache never evicts entries!
// Thought: I should add an LRU eviction policy...
// Action: writeFile("src/data.ts", updatedCode)
// Final Answer: Fixed the memory leak by adding LRU.`
    }
  ];

  currentPattern = computed(() => {
    return this.patterns.find(p => p.id === this.selectedExplorerPattern()) ?? this.patterns[0];
  });

  get exampleTasks(): string[] {
    return [
      this.i18n.t('playground.example_1'),
      this.i18n.t('playground.example_2'),
      this.i18n.t('playground.example_3'),
      this.i18n.t('playground.example_4'),
    ];
  }

  constructor(protected i18n: I18nService) {}

  // ============================================
  // PATTERN EXPLORER
  // ============================================

  selectExplorerPattern(id: string) {
    this.selectedExplorerPattern.set(id);
    this.replayAnimation();
  }

  replayAnimation() {
    if (this.animationTimer) clearInterval(this.animationTimer);
    this.activeStep.set(-1);

    let step = 0;
    const total = this.currentPattern().steps.length;
    this.animationTimer = setInterval(() => {
      if (step < total) {
        this.activeStep.set(step);
        step++;
      } else {
        clearInterval(this.animationTimer);
        this.animationTimer = null;
      }
    }, 600);
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.codeCopied.set(true);
      setTimeout(() => this.codeCopied.set(false), 2000);
    });
  }

  // ============================================
  // AGENT SIMULATOR
  // ============================================

  estimatedCost(): string {
    const tokens = this.estimatedTokens();
    const cost = (tokens / 1000) * 0.015;
    return cost.toFixed(4);
  }

  resetSimulation() {
    this.messages.set([]);
    this.coachMessages.set([]);
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

    if (this.guidedMode) {
      this.coachMessages.set([this.i18n.t('playground.coach_start')]);
    }

    this.isRunning.set(true);
    this.simulateAgent(task);
  }

  private simulateAgent(task: string) {
    const enabledTools = this.availableTools.filter(t => t.enabled).map(t => t.name);
    const steps = this.getSimulationSteps(task, this.selectedPattern, enabledTools);

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        const step = steps[i];
        this.messages.set([...this.messages(), step]);
        this.stepCount.set(this.stepCount() + 1);

        if (step.role === 'tool') {
          this.toolCallCount.set(this.toolCallCount() + 1);
          this.updateToolUsage(step.toolName || 'Unknown');
        }

        if (this.guidedMode && step.coachNote) {
          this.coachMessages.set([...this.coachMessages(), step.coachNote]);
        }

        this.estimatedTokens.set(this.estimatedTokens() + Math.floor(Math.random() * 500 + 200));
        i++;
      } else {
        clearInterval(interval);
        this.isRunning.set(false);
        this.messages.set([...this.messages(), {
          role: 'system',
          content: this.i18n.t('playground.task_complete')
            .replace('{steps}', String(this.stepCount()))
            .replace('{tools}', String(this.toolCallCount()))
            .replace('{tokens}', String(this.estimatedTokens())),
          timestamp: new Date()
        }]);

        if (this.guidedMode) {
          this.coachMessages.set([
            ...this.coachMessages(),
            this.i18n.t('playground.coach_summary')
              .replace('{pattern}', this.i18n.t('playground.pattern_' + this.selectedPattern))
          ]);
        }
      }
    }, this.simSpeed);
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
    const g = this.guidedMode;

    if (pattern === 'hierarchical') {
      return [
        { role: 'agent', content: `I'll orchestrate multiple specialist agents to handle: "${task}"`, thinking: 'Breaking this into sub-tasks that can be delegated to specialists. Each agent has deep expertise in one area.', timestamp: now(), patternTag: 'ORCHESTRATOR', coachNote: g ? this.i18n.t('playground.coach_hier_1') : undefined },
        { role: 'system', content: 'Orchestrator: Delegating to Planner Agent...', timestamp: now(), patternTag: 'DELEGATION', coachNote: g ? this.i18n.t('playground.coach_hier_2') : undefined },
        { role: 'agent', content: 'Planner Agent: Analyzing task complexity and dependencies. Creating execution plan with 4 steps.', thinking: 'Step 1: Understand requirements. Step 2: Search existing code. Step 3: Implement changes. Step 4: Verify with tests.', timestamp: now(), patternTag: 'PLANNER', coachNote: g ? this.i18n.t('playground.coach_hier_3') : undefined },
        { role: 'tool', content: 'Found 3 relevant files: service.ts, controller.ts, types.ts', toolName: 'Search Code', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_tool_search') : undefined },
        { role: 'system', content: 'Orchestrator: Plan approved. Delegating to Coder Agent...', timestamp: now(), patternTag: 'DELEGATION' },
        { role: 'tool', content: 'Reading service.ts (145 lines)', toolName: 'Read File', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_tool_read') : undefined },
        { role: 'agent', content: 'Coder Agent: Implementing the changes based on the plan. Modifying service.ts and adding new endpoint. Following existing code patterns for consistency.', thinking: 'I need to match the existing code style. Using dependency injection pattern I found in the codebase.', timestamp: now(), patternTag: 'CODER', coachNote: g ? this.i18n.t('playground.coach_hier_4') : undefined },
        { role: 'tool', content: 'File updated: service.ts (+32 lines)', toolName: 'Write File', timestamp: now() },
        { role: 'system', content: 'Orchestrator: Code complete. Delegating to Tester Agent...', timestamp: now(), patternTag: 'DELEGATION' },
        { role: 'agent', content: 'Tester Agent: Writing unit tests and running the full test suite to verify no regressions.', thinking: 'Need to test both the happy path and edge cases for the new functionality.', timestamp: now(), patternTag: 'TESTER', coachNote: g ? this.i18n.t('playground.coach_hier_5') : undefined },
        { role: 'tool', content: 'Running test suite... 14 tests passed, 0 failed', toolName: 'Run Shell', timestamp: now() },
        { role: 'system', content: 'Orchestrator: All specialist agents completed. Compiling final results.', timestamp: now(), patternTag: 'ORCHESTRATOR' },
        { role: 'agent', content: 'Task complete! Implementation done by Coder Agent, verified by Tester Agent, ready for review.', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_hier_done') : undefined },
      ];
    }

    if (pattern === 'plan-execute') {
      return [
        { role: 'agent', content: `PLANNING PHASE: I need to create a structured plan before taking any action. Analyzing: "${task}"`, thinking: 'In Plan & Execute, I first reason about ALL steps needed. This prevents wasted work from diving in without a strategy.', timestamp: now(), patternTag: 'PLAN', coachNote: g ? this.i18n.t('playground.coach_plan_1') : undefined },
        { role: 'agent', content: 'Plan created:\n  1. Search for relevant files in the codebase\n  2. Read and understand current implementation\n  3. Implement the required changes\n  4. Run tests to verify correctness\n  5. Commit the working changes', thinking: 'Each step has a clear goal and success criteria. If any step fails, I can re-plan.', timestamp: now(), patternTag: 'PLAN', coachNote: g ? this.i18n.t('playground.coach_plan_2') : undefined },
        { role: 'system', content: 'EXECUTING step 1 of 5: Search for relevant files', timestamp: now(), patternTag: 'EXECUTE' },
        { role: 'tool', content: 'Found files matching pattern: 4 results', toolName: 'Search Code', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_plan_exec') : undefined },
        { role: 'system', content: 'EXECUTING step 2 of 5: Read and understand implementation', timestamp: now(), patternTag: 'EXECUTE' },
        { role: 'tool', content: 'Read main.ts (89 lines), config.ts (23 lines)', toolName: 'Read File', timestamp: now() },
        { role: 'agent', content: 'Analysis complete: The current implementation uses a synchronous pattern. I need to convert to async with proper error handling.', thinking: 'The bottleneck is in the data fetching layer. My plan is still valid — proceeding to step 3.', timestamp: now(), patternTag: 'VALIDATE', coachNote: g ? this.i18n.t('playground.coach_plan_3') : undefined },
        { role: 'system', content: 'EXECUTING step 3 of 5: Implement changes', timestamp: now(), patternTag: 'EXECUTE' },
        { role: 'tool', content: 'Updated main.ts: added async/await pattern, error boundaries', toolName: 'Write File', timestamp: now() },
        { role: 'system', content: 'EXECUTING step 4 of 5: Verify with tests', timestamp: now(), patternTag: 'EXECUTE' },
        { role: 'tool', content: 'npm test: 8 passed, 0 failed', toolName: 'Run Shell', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_plan_4') : undefined },
        { role: 'system', content: 'EXECUTING step 5 of 5: Commit changes', timestamp: now(), patternTag: 'EXECUTE' },
        { role: 'tool', content: 'Created commit: "feat: add async support with error handling"', toolName: 'Git', timestamp: now() },
        { role: 'agent', content: 'All 5 plan steps executed successfully. Each step was validated before moving to the next.', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_plan_done') : undefined },
      ];
    }

    if (pattern === 'react') {
      return [
        { role: 'agent', content: `THOUGHT: I need to understand what "${task}" requires. My first action should be to explore the codebase for relevant files.`, thinking: 'ReAct loop iteration 1: Starting with exploration. I reason first, then act, then observe the result.', timestamp: now(), patternTag: 'THOUGHT', coachNote: g ? this.i18n.t('playground.coach_react_1') : undefined },
        { role: 'agent', content: 'ACTION: Search for relevant files in the codebase', timestamp: now(), patternTag: 'ACTION' },
        { role: 'tool', content: 'Found: src/services/auth.ts, src/middleware/auth.middleware.ts', toolName: 'Search Code', timestamp: now() },
        { role: 'agent', content: 'OBSERVATION: There are 2 auth-related files. I need to read them to understand the current state before making changes.', thinking: 'ReAct loop iteration 2: My observation from the search tells me where to look next. Forming next action.', timestamp: now(), patternTag: 'OBSERVATION', coachNote: g ? this.i18n.t('playground.coach_react_2') : undefined },
        { role: 'agent', content: 'ACTION: Read the auth service file', timestamp: now(), patternTag: 'ACTION' },
        { role: 'tool', content: 'auth.ts: Contains login/logout logic (67 lines), token validation on line 34', toolName: 'Read File', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_react_3') : undefined },
        { role: 'agent', content: 'THOUGHT: I found the issue! The token validation on line 34 doesn\'t handle expired tokens. It only checks if the token exists, not if it\'s still valid.', thinking: 'ReAct loop iteration 3: Key insight from observation. The bug is clear. Now I can form a targeted fix.', timestamp: now(), patternTag: 'THOUGHT', coachNote: g ? this.i18n.t('playground.coach_react_4') : undefined },
        { role: 'agent', content: 'ACTION: Fix the token validation and add refresh mechanism', timestamp: now(), patternTag: 'ACTION' },
        { role: 'tool', content: 'auth.ts updated: added expiry check + token refresh on expiry', toolName: 'Write File', timestamp: now() },
        { role: 'agent', content: 'OBSERVATION: Changes written. I need to verify they work by running tests.', thinking: 'ReAct loop iteration 4: Never assume a fix works — always verify with concrete evidence.', timestamp: now(), patternTag: 'OBSERVATION', coachNote: g ? this.i18n.t('playground.coach_react_5') : undefined },
        { role: 'tool', content: 'All tests passing (12/12)', toolName: 'Run Shell', timestamp: now() },
        { role: 'agent', content: 'THOUGHT: Tests pass. The fix is complete and verified. Each step in my reasoning chain built on the previous observation.', timestamp: now(), patternTag: 'THOUGHT', coachNote: g ? this.i18n.t('playground.coach_react_done') : undefined },
      ];
    }

    // Default: single agent
    return [
      { role: 'agent', content: `I'll handle "${task}" step by step using my available tools.`, thinking: 'As a single agent, I manage the entire workflow myself. I decide what to do, which tools to use, and when I\'m done.', timestamp: now(), patternTag: 'REASONING', coachNote: g ? this.i18n.t('playground.coach_single_1') : undefined },
      { role: 'tool', content: 'Searching codebase for relevant files matching the task...', toolName: 'Search Code', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_single_2') : undefined },
      { role: 'tool', content: 'Found 2 relevant files: handler.ts, utils.ts', toolName: 'Search Code', timestamp: now() },
      { role: 'agent', content: 'Let me read these files to understand the current implementation before making changes.', thinking: 'Good practice: always read before writing. I need context to make correct modifications.', timestamp: now(), patternTag: 'REASONING', coachNote: g ? this.i18n.t('playground.coach_single_3') : undefined },
      { role: 'tool', content: 'Reading handler.ts (94 lines) — found the function to modify', toolName: 'Read File', timestamp: now() },
      { role: 'agent', content: 'I understand the current implementation. The change requires modifying the handler and adding a new utility function.', thinking: 'I have enough context now. Time to implement the changes based on what I\'ve learned.', timestamp: now(), patternTag: 'REASONING' },
      { role: 'tool', content: 'File updated: handler.ts (+18 lines, -3 lines)', toolName: 'Write File', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_single_4') : undefined },
      { role: 'tool', content: 'Running tests... All 9 tests passed', toolName: 'Run Shell', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_single_5') : undefined },
      { role: 'agent', content: 'Done! Changes have been implemented, tested, and verified. The single agent handled the entire workflow from analysis to verification.', timestamp: now(), coachNote: g ? this.i18n.t('playground.coach_single_done') : undefined },
    ];
  }

  // ============================================
  // BUILD YOUR OWN
  // ============================================

  addNodeToWorkflow(type: string, label: string, icon: string) {
    const id = `node-${++this.nodeCounter}`;
    const nodes = [...this.workflowNodes()];
    const config: Record<string, string> = {};

    if (type === 'agent') config['model'] = 'opus';
    if (type === 'agent') config['role'] = 'general';
    if (type === 'tool') config['toolType'] = 'read';

    nodes.push({ id, type: type as WorkflowNode['type'], label, icon, x: 0, y: 0, config });
    this.workflowNodes.set(nodes);
    this.selectedNodeId.set(id);
    this.detectPattern();
  }

  removeNode(id: string) {
    this.workflowNodes.set(this.workflowNodes().filter(n => n.id !== id));
    if (this.selectedNodeId() === id) this.selectedNodeId.set(null);
    this.detectPattern();
  }

  selectNode(id: string) {
    this.selectedNodeId.set(this.selectedNodeId() === id ? null : id);
  }

  getSelectedNode(): WorkflowNode | undefined {
    return this.workflowNodes().find(n => n.id === this.selectedNodeId());
  }

  getNodeConfigEntries(node: WorkflowNode): [string, string][] {
    return node.config ? Object.entries(node.config) : [];
  }

  updateNodeLabel(label: string) {
    const nodes = this.workflowNodes().map(n =>
      n.id === this.selectedNodeId() ? { ...n, label } : n
    );
    this.workflowNodes.set(nodes);
  }

  updateNodeConfig(key: string, value: string) {
    const nodes = this.workflowNodes().map(n => {
      if (n.id === this.selectedNodeId()) {
        return { ...n, config: { ...(n.config || {}), [key]: value } };
      }
      return n;
    });
    this.workflowNodes.set(nodes);
  }

  clearWorkflow() {
    this.workflowNodes.set([]);
    this.selectedNodeId.set(null);
    this.generatedCode.set('');
    this.detectedPattern.set('');
  }

  detectPattern() {
    const nodes = this.workflowNodes();
    const agentCount = nodes.filter(n => n.type === 'agent').length;
    const hasCondition = nodes.some(n => n.type === 'condition');
    const toolCount = nodes.filter(n => n.type === 'tool').length;

    if (agentCount >= 3) {
      this.detectedPattern.set('hierarchical');
    } else if (agentCount >= 2 && hasCondition) {
      this.detectedPattern.set('plan-execute');
    } else if (agentCount >= 1 && toolCount >= 2 && hasCondition) {
      this.detectedPattern.set('react');
    } else if (agentCount === 1) {
      this.detectedPattern.set('single');
    } else {
      this.detectedPattern.set('');
    }
  }

  generateWorkflowCode() {
    const nodes = this.workflowNodes();
    if (nodes.length === 0) return;

    let code = `// Auto-generated Orchestration Code\n`;
    code += `import { Agent, Tool, Workflow } from '@anthropic/agent-sdk';\n\n`;

    // Generate tool definitions
    const tools = nodes.filter(n => n.type === 'tool');
    if (tools.length > 0) {
      code += `// --- Tool Definitions ---\n`;
      for (const tool of tools) {
        const toolType = tool.config?.['toolType'] ?? 'read';
        code += `const ${toolType}Tool = new Tool({\n`;
        code += `  name: "${toolType}",\n`;
        code += `  description: "Handles ${toolType} operations"\n`;
        code += `});\n\n`;
      }
    }

    // Generate agent definitions
    const agents = nodes.filter(n => n.type === 'agent');
    if (agents.length > 0) {
      code += `// --- Agent Definitions ---\n`;
      for (const agent of agents) {
        const model = agent.config?.['model'] ?? 'opus';
        const role = agent.config?.['role'] ?? 'general';
        const varName = `${role}Agent`;
        code += `const ${varName} = new Agent({\n`;
        code += `  model: "claude-${model}-4",\n`;
        code += `  role: "${role}",\n`;
        if (tools.length > 0) {
          code += `  tools: [${tools.map(t => (t.config?.['toolType'] ?? 'read') + 'Tool').join(', ')}],\n`;
        }
        code += `  systemPrompt: "You are a ${role} agent."\n`;
        code += `});\n\n`;
      }
    }

    // Generate workflow
    code += `// --- Workflow Execution ---\n`;
    code += `const workflow = new Workflow({ name: "custom-pipeline" });\n\n`;

    const trigger = nodes.find(n => n.type === 'trigger');
    if (trigger) {
      code += `workflow.onTrigger(async (input) => {\n`;
    } else {
      code += `workflow.run(async (input) => {\n`;
    }

    const conditions = nodes.filter(n => n.type === 'condition');
    let indent = '  ';

    for (const agent of agents) {
      const role = agent.config?.['role'] ?? 'general';
      code += `${indent}const ${role}Result = await ${role}Agent.run(input);\n`;
    }

    for (const cond of conditions) {
      const expr = cond.config?.['expression'] ?? 'result.success';
      code += `\n${indent}if (${expr}) {\n`;
      code += `${indent}  // Condition passed — continue pipeline\n`;
      code += `${indent}} else {\n`;
      code += `${indent}  // Condition failed — handle error or retry\n`;
      code += `${indent}}\n`;
    }

    const output = nodes.find(n => n.type === 'output');
    if (output) {
      const lastAgent = agents[agents.length - 1];
      const resultVar = lastAgent ? `${lastAgent.config?.['role'] ?? 'general'}Result` : 'input';
      code += `\n${indent}return ${resultVar};\n`;
    }

    code += `});\n`;

    this.generatedCode.set(code);
    this.detectPattern();
  }
}
