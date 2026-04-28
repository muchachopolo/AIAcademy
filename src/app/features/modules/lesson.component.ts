import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LearningDataService } from '../../core/services/learning-data.service';
import { AdvancedLearningDataService } from '../../core/services/advanced-learning-data.service';
import { ProgressService } from '../../core/services/progress.service';
import { I18nService } from '../../core/services/i18n.service';
import { Lesson, ContentBlock, QuizQuestion } from '../../core/models/learning.model';

@Component({
  selector: 'app-lesson',
  imports: [RouterLink],
  template: `
    @if (lesson) {
      <div class="lesson-page">
        <a [routerLink]="['/module', moduleId]" class="back-link">{{ i18n.t('lesson.back_to') }} {{ moduleTitle }}</a>

        <header class="lesson-header">
          <h1>{{ lesson.title }}</h1>
          <p>{{ lesson.description }}</p>
        </header>

        <div class="content-blocks">
          @for (block of lesson.content; track $index) {
            <div class="content-block" [class]="'block-' + block.type">
              @switch (block.type) {
                @case ('text') {
                  <div class="text-content" [innerHTML]="renderMarkdown(block.content)"></div>
                }
                @case ('code') {
                  <div class="code-block">
                    <div class="code-header">
                      <span class="code-lang">{{ block.language }}</span>
                      <button class="copy-btn" (click)="copyCode(block.content)">
                        {{ copiedIndex() === $index ? i18n.t('lesson.copied') : i18n.t('lesson.copy') }}
                      </button>
                    </div>
                    <pre><code>{{ block.content }}</code></pre>
                  </div>
                }
                @case ('tip') {
                  <div class="callout tip">
                    <span class="callout-icon">💡</span>
                    <div class="callout-content">{{ block.content }}</div>
                  </div>
                }
                @case ('warning') {
                  <div class="callout warning">
                    <span class="callout-icon">⚠️</span>
                    <div class="callout-content">{{ block.content }}</div>
                  </div>
                }
                @case ('diagram') {
                  <div class="diagram-block">
                    <div class="diagram-placeholder">
                      <span>📊</span>
                      <span>Interactive Diagram: {{ block.content }}</span>
                    </div>
                  </div>
                }
                @case ('agent-demo') {
                  <div class="agent-demo-block">
                    <div class="demo-header">
                      <span>🤖</span>
                      <span>Interactive Agent Demo</span>
                    </div>
                    <div class="demo-content">
                      <button class="run-demo-btn" (click)="runDemo(block.content)">
                        {{ i18n.t('lesson.run_demo') }} {{ block.content }}
                      </button>
                      @if (demoRunning()) {
                        <div class="demo-output">
                          @for (step of demoSteps(); track step.id) {
                            <div class="demo-step" [class]="'step-' + step.status">
                              <div class="step-header">
                                <span class="step-agent">{{ step.agent }}</span>
                                <span class="step-status">{{ step.status }}</span>
                              </div>
                              <div class="step-action">{{ step.action }}</div>
                              @if (step.thinking) {
                                <div class="step-thinking">💭 {{ step.thinking }}</div>
                              }
                              @if (step.output) {
                                <div class="step-output">→ {{ step.output }}</div>
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
                @case ('interactive') {
                  <div class="interactive-block">
                    <div class="interactive-placeholder">
                      <span>🎮</span>
                      <span>Interactive Exercise: {{ block.metadata?.['type'] || block.content }}</span>
                    </div>
                  </div>
                }
              }
            </div>
          }
        </div>

        @if (lesson.quiz && lesson.quiz.length > 0) {
          <section class="quiz-section">
            <h2>{{ i18n.t('lesson.knowledge_check') }}</h2>
            @if (!quizCompleted()) {
              @for (q of lesson.quiz; track q.id; let qi = $index) {
                <div class="quiz-question" [class.answered]="quizAnswers()[qi] !== undefined">
                  <p class="question-text">{{ qi + 1 }}. {{ q.question }}</p>
                  <div class="options">
                    @for (opt of q.options; track opt; let oi = $index) {
                      <button
                        class="option-btn"
                        [class.selected]="quizAnswers()[qi] === oi"
                        [class.correct]="quizAnswers()[qi] !== undefined && oi === q.correctIndex"
                        [class.wrong]="quizAnswers()[qi] === oi && oi !== q.correctIndex"
                        (click)="answerQuestion(qi, oi)"
                        [disabled]="quizAnswers()[qi] !== undefined"
                      >
                        {{ opt }}
                      </button>
                    }
                  </div>
                  @if (quizAnswers()[qi] !== undefined) {
                    <div class="explanation" [class.correct]="quizAnswers()[qi] === q.correctIndex">
                      {{ q.explanation }}
                    </div>
                  }
                </div>
              }
              @if (allQuestionsAnswered()) {
                <button class="submit-quiz-btn" (click)="submitQuiz()">
                  {{ i18n.t('lesson.complete_lesson') }}
                </button>
              }
            } @else {
              <div class="quiz-result">
                <div class="result-score">
                  <span class="score-value">{{ quizScore() }}%</span>
                  <span class="score-label">{{ i18n.t('lesson.score') }}</span>
                </div>
                <p>{{ quizScore()! >= 80 ? i18n.t('lesson.excellent') : i18n.t('lesson.review') }}</p>
              </div>
            }
          </section>
        } @else {
          <div class="complete-section">
            @if (!isCompleted()) {
              <button class="complete-btn" (click)="markComplete()">
                {{ i18n.t('lesson.mark_complete') }}
              </button>
            } @else {
              <div class="completed-badge">{{ i18n.t('lesson.completed') }}</div>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .lesson-page {
      max-width: 800px;
      margin: 0 auto;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      color: var(--text-muted);
      text-decoration: none;
      &:hover { color: var(--primary-light); }
    }

    .lesson-header {
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);

      h1 {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      p {
        color: var(--text-secondary);
        font-size: 0.95rem;
      }
    }

    .content-blocks {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .text-content {
      line-height: 1.7;
      color: var(--text-secondary);
      font-size: 0.95rem;

      :deep(h2) { font-size: 1.4rem; font-weight: 600; color: var(--text-primary); margin: 1.5rem 0 0.75rem; }
      :deep(h3) { font-size: 1.15rem; font-weight: 600; color: var(--text-primary); margin: 1.25rem 0 0.5rem; }
      :deep(strong) { color: var(--text-primary); }
      :deep(code) { background: var(--bg-surface); padding: 0.15rem 0.4rem; border-radius: 3px; font-size: 0.85rem; }
      :deep(table) { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
      :deep(th), :deep(td) { padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; }
      :deep(th) { background: var(--bg-surface); color: var(--text-primary); font-weight: 600; }
      :deep(pre) { background: var(--bg-dark); padding: 1rem; border-radius: var(--radius-sm); overflow-x: auto; border: 1px solid var(--border); }
    }

    .code-block {
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
    }

    .code-lang {
      font-size: 0.75rem;
      color: var(--primary-light);
      font-weight: 600;
      text-transform: uppercase;
    }

    .copy-btn {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;

      &:hover { border-color: var(--primary); color: var(--primary-light); }
    }

    .code-block pre {
      margin: 0;
      padding: 1rem;
      background: var(--bg-dark);
      border: none;
      border-radius: 0;
    }

    .code-block code {
      font-size: 0.83rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    .callout {
      display: flex;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-sm);
      border: 1px solid;

      &.tip {
        background: rgba(0, 206, 201, 0.05);
        border-color: rgba(0, 206, 201, 0.3);
      }
      &.warning {
        background: rgba(253, 203, 110, 0.05);
        border-color: rgba(253, 203, 110, 0.3);
      }
    }

    .callout-icon { font-size: 1.1rem; flex-shrink: 0; }
    .callout-content { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }

    .agent-demo-block {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      font-size: 0.85rem;
      font-weight: 600;
    }

    .demo-content {
      padding: 1.5rem;
    }

    .run-demo-btn {
      padding: 0.75rem 1.5rem;
      background: var(--gradient-primary);
      border: none;
      border-radius: var(--radius-sm);
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: opacity 0.2s;
      &:hover { opacity: 0.9; }
    }

    .demo-output {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .demo-step {
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      border-left: 3px solid var(--border);
      background: var(--bg-dark);
      animation: fadeIn 0.3s ease;

      &.step-running { border-left-color: var(--warning); }
      &.step-complete { border-left-color: var(--success); }
      &.step-error { border-left-color: var(--danger); }
    }

    .step-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .step-agent { font-size: 0.8rem; font-weight: 600; color: var(--primary-light); }
    .step-status { font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); }
    .step-action { font-size: 0.85rem; color: var(--text-secondary); }
    .step-thinking { font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-top: 0.25rem; }
    .step-output { font-size: 0.8rem; color: var(--accent); margin-top: 0.25rem; }

    .diagram-block, .interactive-block {
      padding: 2rem;
      background: var(--bg-surface);
      border: 1px dashed var(--border);
      border-radius: var(--radius-md);
      text-align: center;
    }

    .diagram-placeholder, .interactive-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    /* Quiz styles */
    .quiz-section {
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      margin-bottom: 2rem;

      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }
    }

    .quiz-question {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);

      &:last-of-type { border-bottom: none; }
    }

    .question-text {
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .option-btn {
      padding: 0.75rem 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-align: left;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        border-color: var(--primary);
        color: var(--text-primary);
      }

      &.selected { border-color: var(--primary); background: rgba(108, 92, 231, 0.1); }
      &.correct { border-color: var(--success); background: rgba(0, 184, 148, 0.1); color: var(--success); }
      &.wrong { border-color: var(--danger); background: rgba(225, 112, 85, 0.1); color: var(--danger); }
    }

    .explanation {
      margin-top: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      line-height: 1.5;
      background: rgba(225, 112, 85, 0.05);
      border: 1px solid rgba(225, 112, 85, 0.2);
      color: var(--text-secondary);

      &.correct {
        background: rgba(0, 184, 148, 0.05);
        border-color: rgba(0, 184, 148, 0.2);
      }
    }

    .submit-quiz-btn, .complete-btn {
      padding: 0.75rem 2rem;
      background: var(--gradient-primary);
      border: none;
      border-radius: var(--radius-sm);
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      margin-top: 1rem;
      &:hover { opacity: 0.9; }
    }

    .complete-section {
      text-align: center;
      padding: 2rem;
    }

    .completed-badge {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: rgba(0, 184, 148, 0.1);
      border: 1px solid var(--success);
      border-radius: var(--radius-sm);
      color: var(--success);
      font-weight: 600;
    }

    .quiz-result {
      text-align: center;
      padding: 2rem;

      p { color: var(--text-secondary); margin-top: 1rem; }
    }

    .result-score {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .score-value {
      font-size: 3rem;
      font-weight: 700;
      color: var(--accent);
    }

    .score-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LessonComponent implements OnInit {
  lesson?: Lesson;
  moduleId = '';
  moduleTitle = '';
  copiedIndex = signal<number | null>(null);
  quizAnswers = signal<(number | undefined)[]>([]);
  quizCompleted = signal(false);
  quizScore = signal<number | null>(null);
  demoRunning = signal(false);
  demoSteps = signal<any[]>([]);

  constructor(
    private route: ActivatedRoute,
    private dataService: LearningDataService,
    private advancedDataService: AdvancedLearningDataService,
    private progress: ProgressService,
    protected i18n: I18nService
  ) {}

  ngOnInit() {
    this.moduleId = this.route.snapshot.paramMap.get('moduleId') || '';
    const lessonId = this.route.snapshot.paramMap.get('lessonId') || '';
    const allModules = [
      ...this.dataService.getModules(),
      ...this.advancedDataService.getAdvancedModules()
    ];
    const module = allModules.find(m => m.id === this.moduleId);
    if (module) {
      this.moduleTitle = module.title;
      this.lesson = module.lessons.find(l => l.id === lessonId);
      if (this.lesson?.quiz) {
        this.quizAnswers.set(new Array(this.lesson.quiz.length).fill(undefined));
      }
    }
  }

  renderMarkdown(text: string): string {
    return text
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^\| (.+) \|$/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
      })
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
    const idx = this.lesson?.content.findIndex(b => b.content === code) ?? null;
    this.copiedIndex.set(idx);
    setTimeout(() => this.copiedIndex.set(null), 2000);
  }

  answerQuestion(questionIdx: number, optionIdx: number) {
    const answers = [...this.quizAnswers()];
    if (answers[questionIdx] !== undefined) return;
    answers[questionIdx] = optionIdx;
    this.quizAnswers.set(answers);
  }

  allQuestionsAnswered(): boolean {
    return this.quizAnswers().every(a => a !== undefined);
  }

  submitQuiz() {
    if (!this.lesson?.quiz) return;
    const correct = this.quizAnswers().filter((a, i) => a === this.lesson!.quiz![i].correctIndex).length;
    const score = Math.round((correct / this.lesson.quiz.length) * 100);
    this.quizScore.set(score);
    this.quizCompleted.set(true);
    this.progress.markCompleted(this.moduleId, this.lesson.id, score);
  }

  markComplete() {
    if (this.lesson) {
      this.progress.markCompleted(this.moduleId, this.lesson.id);
    }
  }

  isCompleted(): boolean {
    return this.lesson ? this.progress.isCompleted(this.moduleId, this.lesson.id) : false;
  }

  runDemo(demoType: string) {
    this.demoRunning.set(true);
    this.demoSteps.set([]);

    const demos: Record<string, any[]> = {
      'simple-agent-loop': [
        { id: 1, agent: 'Agent', action: 'Analyzing user goal...', thinking: 'I need to break this task into steps', output: '', tools: [], status: 'running' },
        { id: 2, agent: 'Agent', action: 'Calling tool: read_file("src/app.ts")', thinking: 'Let me look at the existing code first', output: 'File contents retrieved (42 lines)', tools: ['read_file'], status: 'complete' },
        { id: 3, agent: 'Agent', action: 'Calling tool: edit_file("src/app.ts")', thinking: 'I\'ll add the new feature here', output: 'File updated successfully', tools: ['edit_file'], status: 'complete' },
        { id: 4, agent: 'Agent', action: 'Calling tool: run_tests()', thinking: 'Let me verify the changes work', output: 'All 12 tests passed ✓', tools: ['run_tests'], status: 'complete' },
        { id: 5, agent: 'Agent', action: 'Task complete!', thinking: '', output: 'Feature implemented and all tests passing', tools: [], status: 'complete' },
      ],
      'orchestration-simulator': [
        { id: 1, agent: 'Orchestrator', action: 'Receiving task: "Implement user authentication"', thinking: 'This needs multiple specialists', output: 'Creating execution plan...', tools: [], status: 'running' },
        { id: 2, agent: 'Orchestrator', action: 'Delegating to Architect Agent', thinking: 'Need design decisions first', output: 'Plan: OAuth2 + PKCE flow, 3 services', tools: [], status: 'complete' },
        { id: 3, agent: 'Code Agent', action: 'Implementing auth service', thinking: 'Following the architect\'s design', output: 'Created auth.service.ts, token.service.ts', tools: ['write_file', 'edit_file'], status: 'complete' },
        { id: 4, agent: 'Test Agent', action: 'Writing test suite', thinking: 'Need unit + integration tests', output: 'Created 24 test cases, all passing', tools: ['write_file', 'run_tests'], status: 'complete' },
        { id: 5, agent: 'Review Agent', action: 'Reviewing implementation', thinking: 'Checking security and quality', output: 'Score: 9/10 - No vulnerabilities found', tools: ['read_file'], status: 'complete' },
        { id: 6, agent: 'Orchestrator', action: 'All agents complete', thinking: '', output: 'PR #142 created with full implementation', tools: [], status: 'complete' },
      ],
      'jira-pipeline-demo': [
        { id: 1, agent: 'Pipeline', action: 'Reading Jira ticket PROJ-456', thinking: 'Fetching requirements and acceptance criteria', output: 'Ticket: "Add pagination to user list API"', tools: ['jira_get_ticket'], status: 'complete' },
        { id: 2, agent: 'Analyzer', action: 'Parsing requirements', thinking: 'Identifying scope and constraints', output: 'Need: cursor pagination, 50 items/page, sort support', tools: [], status: 'complete' },
        { id: 3, agent: 'Planner', action: 'Designing implementation', thinking: 'Existing endpoint needs modification', output: 'Plan: Modify GET /users, add cursor param, update response schema', tools: ['read_file'], status: 'complete' },
        { id: 4, agent: 'Coder', action: 'Implementing pagination', thinking: 'Adding cursor-based pagination to the controller', output: 'Modified 3 files: controller, service, types', tools: ['edit_file', 'write_file'], status: 'complete' },
        { id: 5, agent: 'Tester', action: 'Adding test coverage', thinking: 'Need edge cases: empty, last page, invalid cursor', output: '8 new tests, all passing', tools: ['write_file', 'run_tests'], status: 'complete' },
        { id: 6, agent: 'Pipeline', action: 'Creating pull request', thinking: 'Linking back to Jira ticket', output: 'PR #89 created, Jira ticket moved to "In Review"', tools: ['git_commit', 'create_pr', 'jira_transition'], status: 'complete' },
      ]
    };

    const steps = demos[demoType] || demos['simple-agent-loop'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        this.demoSteps.set([...this.demoSteps(), steps[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
  }
}
