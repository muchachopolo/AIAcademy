import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LearningDataService } from '../../core/services/learning-data.service';
import { AdvancedLearningDataService } from '../../core/services/advanced-learning-data.service';
import { ProgressService } from '../../core/services/progress.service';
import { I18nService } from '../../core/services/i18n.service';
import { LearningModule } from '../../core/models/learning.model';

@Component({
  selector: 'app-module-detail',
  imports: [RouterLink],
  template: `
    @if (module) {
      <div class="module-detail">
        <a routerLink="/" class="back-link">{{ i18n.t('module.back') }}</a>

        <header class="module-header" [style.--module-color]="module.color">
          <div class="module-icon-large">{{ module.icon }}</div>
          <div>
            <h1>{{ i18n.t('mod.' + module.id + '.title') }}</h1>
            <p>{{ i18n.t('mod.' + module.id + '.desc') }}</p>
          </div>
        </header>

        <div class="lessons-list">
          @for (lesson of module.lessons; track lesson.id; let i = $index) {
            <a [routerLink]="['/module', module.id, 'lesson', lesson.id]" class="lesson-card" [class.completed]="isCompleted(lesson.id)">
              <div class="lesson-number" [class.done]="isCompleted(lesson.id)">
                @if (isCompleted(lesson.id)) {
                  <span>✓</span>
                } @else {
                  <span>{{ i + 1 }}</span>
                }
              </div>
              <div class="lesson-info">
                <h3>{{ lesson.title }}</h3>
                <p>{{ lesson.description }}</p>
                <div class="lesson-tags">
                  <span class="tag">{{ lesson.content.length }} {{ i18n.t('lesson.sections') }}</span>
                  @if (lesson.quiz) {
                    <span class="tag quiz-tag">{{ i18n.t('lesson.quiz') }}</span>
                  }
                  @if (getQuizScore(lesson.id) !== undefined) {
                    <span class="tag score-tag">Score: {{ getQuizScore(lesson.id) }}%</span>
                  }
                </div>
              </div>
              <div class="lesson-arrow">→</div>
            </a>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .module-detail {
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

    .module-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      border-left: 5px solid var(--module-color);
      margin-bottom: 2rem;

      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
    }

    .module-icon-large {
      font-size: 3rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(108, 92, 231, 0.1);
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }

    .lessons-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .lesson-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-card-hover);
        transform: translateX(4px);
      }

      &.completed {
        border-color: rgba(0, 184, 148, 0.3);
      }
    }

    .lesson-number {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface);
      border: 2px solid var(--border);
      border-radius: 50%;
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--text-muted);
      flex-shrink: 0;

      &.done {
        background: rgba(0, 184, 148, 0.15);
        border-color: var(--success);
        color: var(--success);
      }
    }

    .lesson-info {
      flex: 1;

      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      p {
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }
    }

    .lesson-tags {
      display: flex;
      gap: 0.5rem;
    }

    .tag {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      background: var(--bg-surface);
      border-radius: 4px;
      color: var(--text-muted);
    }

    .quiz-tag { color: var(--warning); background: rgba(253, 203, 110, 0.1); }
    .score-tag { color: var(--success); background: rgba(0, 184, 148, 0.1); }

    .lesson-arrow {
      color: var(--text-muted);
      font-size: 1.25rem;
    }

    .lesson-card:hover .lesson-arrow {
      color: var(--primary-light);
    }
  `]
})
export class ModuleDetailComponent implements OnInit {
  module?: LearningModule;

  constructor(
    private route: ActivatedRoute,
    private dataService: LearningDataService,
    private advancedDataService: AdvancedLearningDataService,
    private progress: ProgressService,
    protected i18n: I18nService
  ) {}

  ngOnInit() {
    const moduleId = this.route.snapshot.paramMap.get('moduleId');
    const allModules = [
      ...this.dataService.getModules(),
      ...this.advancedDataService.getAdvancedModules()
    ];
    this.module = allModules.find(m => m.id === moduleId);
  }

  isCompleted(lessonId: string): boolean {
    return this.module ? this.progress.isCompleted(this.module.id, lessonId) : false;
  }

  getQuizScore(lessonId: string): number | undefined {
    return this.module ? this.progress.getQuizScore(this.module.id, lessonId) : undefined;
  }
}
