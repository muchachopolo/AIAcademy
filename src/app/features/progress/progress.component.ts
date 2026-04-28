import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LearningDataService } from '../../core/services/learning-data.service';
import { AdvancedLearningDataService } from '../../core/services/advanced-learning-data.service';
import { ProgressService } from '../../core/services/progress.service';
import { I18nService } from '../../core/services/i18n.service';
import { LearningModule } from '../../core/models/learning.model';

@Component({
  selector: 'app-progress',
  imports: [RouterLink],
  template: `
    <div class="progress-page">
      <header class="progress-header">
        <h1>{{ i18n.t('progress.title') }}</h1>
        <p>{{ i18n.t('progress.subtitle') }}</p>
      </header>

      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-value">{{ completedLessons }}</div>
          <div class="card-label">{{ i18n.t('progress.lessons_completed') }}</div>
          <div class="card-bar">
            <div class="card-bar-fill" [style.width.%]="overallProgress"></div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-value">{{ totalLessons }}</div>
          <div class="card-label">{{ i18n.t('progress.total_lessons') }}</div>
        </div>
        <div class="overview-card">
          <div class="card-value">{{ overallProgress }}%</div>
          <div class="card-label">{{ i18n.t('progress.overall') }}</div>
        </div>
        <div class="overview-card">
          <div class="card-value">{{ modulesCompleted }}</div>
          <div class="card-label">{{ i18n.t('progress.modules_mastered') }}</div>
        </div>
      </div>

      <section class="module-progress-section">
        <h2>{{ i18n.t('progress.breakdown') }}</h2>
        @for (module of modules; track module.id) {
          <div class="module-progress-card">
            <div class="module-progress-header">
              <span class="module-progress-icon">{{ module.icon }}</span>
              <div class="module-progress-info">
                <h3>{{ i18n.t('mod.' + module.id + '.title') }}</h3>
                <p>{{ getModuleProgress(module) }}% {{ i18n.t('progress.complete') }} — {{ getCompletedCount(module) }}/{{ module.lessons.length }}</p>
              </div>
              <a [routerLink]="['/module', module.id]" class="continue-btn">
                {{ getModuleProgress(module) === 100 ? i18n.t('progress.review') : i18n.t('progress.continue') }} →
              </a>
            </div>
            <div class="module-progress-bar">
              <div class="module-bar-fill" [style.width.%]="getModuleProgress(module)" [style.background]="module.color"></div>
            </div>
            <div class="lesson-dots">
              @for (lesson of module.lessons; track lesson.id) {
                <div class="lesson-dot" [class.completed]="isCompleted(module.id, lesson.id)" [title]="lesson.title"></div>
              }
            </div>
          </div>
        }
      </section>

      <div class="reset-section">
        <button class="reset-btn" (click)="confirmReset()">{{ i18n.t('progress.reset') }}</button>
      </div>
    </div>
  `,
  styles: [`
    .progress-page {
      max-width: 900px;
      margin: 0 auto;
    }

    .progress-header {
      margin-bottom: 2rem;
      h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
      p { color: var(--text-secondary); font-size: 0.9rem; }
    }

    .overview-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .overview-card {
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      text-align: center;
    }

    .card-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 0.25rem;
    }

    .card-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .card-bar {
      margin-top: 0.75rem;
      height: 4px;
      background: var(--border);
      border-radius: 2px;
      overflow: hidden;
    }

    .card-bar-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 2px;
      transition: width 0.5s;
    }

    .module-progress-section {
      margin-bottom: 2rem;
      h2 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }
    }

    .module-progress-card {
      padding: 1.25rem 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      margin-bottom: 0.75rem;
    }

    .module-progress-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .module-progress-icon {
      font-size: 1.5rem;
    }

    .module-progress-info {
      flex: 1;
      h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.15rem; }
      p { font-size: 0.8rem; color: var(--text-muted); }
    }

    .continue-btn {
      padding: 0.4rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary-light);
      border: 1px solid var(--primary);
      border-radius: var(--radius-sm);
      text-decoration: none;
      transition: all 0.2s;

      &:hover { background: rgba(108, 92, 231, 0.1); }
    }

    .module-progress-bar {
      height: 6px;
      background: var(--border);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.75rem;
    }

    .module-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s;
    }

    .lesson-dots {
      display: flex;
      gap: 6px;
    }

    .lesson-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--border);
      transition: background 0.2s;

      &.completed {
        background: var(--success);
      }
    }

    .reset-section {
      text-align: center;
      padding: 2rem 0;
    }

    .reset-btn {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--danger);
      border-radius: var(--radius-sm);
      color: var(--danger);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(225, 112, 85, 0.1);
      }
    }
  `]
})
export class ProgressComponent {
  modules: LearningModule[];
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  modulesCompleted: number;

  constructor(
    private dataService: LearningDataService,
    private advancedDataService: AdvancedLearningDataService,
    private progress: ProgressService,
    protected i18n: I18nService
  ) {
    this.modules = [
      ...this.dataService.getModules(),
      ...this.advancedDataService.getAdvancedModules()
    ].sort((a, b) => a.order - b.order);
    this.totalLessons = this.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    this.completedLessons = this.progress.completedCount();
    this.overallProgress = this.totalLessons > 0 ? Math.round((this.completedLessons / this.totalLessons) * 100) : 0;
    this.modulesCompleted = this.modules.filter(m => this.getModuleProgress(m) === 100).length;
  }

  getModuleProgress(module: LearningModule): number {
    return this.progress.getModuleProgress(module.id, module.lessons.length);
  }

  getCompletedCount(module: LearningModule): number {
    return module.lessons.filter(l => this.progress.isCompleted(module.id, l.id)).length;
  }

  isCompleted(moduleId: string, lessonId: string): boolean {
    return this.progress.isCompleted(moduleId, lessonId);
  }

  confirmReset() {
    if (confirm(this.i18n.t('progress.reset_confirm'))) {
      this.progress.resetProgress();
      window.location.reload();
    }
  }
}
