import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LearningDataService } from '../../core/services/learning-data.service';
import { AdvancedLearningDataService } from '../../core/services/advanced-learning-data.service';
import { ProgressService } from '../../core/services/progress.service';
import { I18nService } from '../../core/services/i18n.service';
import { LearningModule } from '../../core/models/learning.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>{{ i18n.t('dashboard.title') }}</h1>
          <p class="subtitle">{{ i18n.t('dashboard.subtitle') }}</p>
        </div>
        <div class="header-stats">
          <div class="stat">
            <span class="stat-value">{{ modules.length }}</span>
            <span class="stat-label">{{ i18n.t('dashboard.modules') }}</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ totalLessons }}</span>
            <span class="stat-label">{{ i18n.t('dashboard.lessons') }}</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ progress.completedCount() }}</span>
            <span class="stat-label">{{ i18n.t('dashboard.completed') }}</span>
          </div>
        </div>
      </header>

      <section class="learning-path">
        <h2>{{ i18n.t('dashboard.learning_path') }}</h2>
        <div class="modules-grid">
          @for (module of modules; track module.id) {
            <a [routerLink]="['/module', module.id]" class="module-card" [style.--module-color]="module.color">
              <div class="module-icon">{{ module.icon }}</div>
              <div class="module-info">
                <h3>{{ i18n.t('mod.' + module.id + '.title') }}</h3>
                <p>{{ i18n.t('mod.' + module.id + '.desc') }}</p>
                <div class="module-meta">
                  <span class="lesson-count">{{ module.lessons.length }} {{ i18n.t('dashboard.lessons_suffix') }}</span>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="getModuleProgress(module)"></div>
                  </div>
                  <span class="progress-text">{{ getModuleProgress(module) }}%</span>
                </div>
              </div>
              <div class="module-arrow">→</div>
            </a>
          }
        </div>
      </section>

      <section class="quick-start">
        <h2>{{ i18n.t('dashboard.quick_start') }}</h2>
        <div class="quick-cards">
          <div class="quick-card">
            <span class="quick-icon">💬</span>
            <h4>{{ i18n.t('dashboard.quick_ai_title') }}</h4>
            <p>{{ i18n.t('dashboard.quick_ai_desc') }}</p>
            <a routerLink="/module/foundations" class="quick-link">{{ i18n.t('dashboard.quick_ai_link') }}</a>
          </div>
          <div class="quick-card">
            <span class="quick-icon">🔧</span>
            <h4>{{ i18n.t('dashboard.quick_build_title') }}</h4>
            <p>{{ i18n.t('dashboard.quick_build_desc') }}</p>
            <a routerLink="/module/agent-basics" class="quick-link">{{ i18n.t('dashboard.quick_build_link') }}</a>
          </div>
          <div class="quick-card">
            <span class="quick-icon">🧪</span>
            <h4>{{ i18n.t('dashboard.quick_play_title') }}</h4>
            <p>{{ i18n.t('dashboard.quick_play_desc') }}</p>
            <a routerLink="/playground" class="quick-link">{{ i18n.t('dashboard.quick_play_link') }}</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1000px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 3rem;
      padding: 2rem;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
    }

    .header-content h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      max-width: 500px;
    }

    .header-stats {
      display: flex;
      gap: 1.5rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem 1rem;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--accent);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .learning-path {
      margin-bottom: 3rem;
    }

    .learning-path h2, .quick-start h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }

    .modules-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .module-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: inherit;
      transition: all 0.3s;
      border-left: 4px solid var(--module-color);

      &:hover {
        background: var(--bg-card-hover);
        transform: translateX(4px);
        box-shadow: var(--shadow-md);
      }
    }

    .module-icon {
      font-size: 2rem;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(108, 92, 231, 0.1);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }

    .module-info {
      flex: 1;

      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: var(--text-primary);
      }

      p {
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin-bottom: 0.75rem;
      }
    }

    .module-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .lesson-count {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .progress-bar {
      flex: 1;
      max-width: 120px;
      height: 4px;
      background: var(--border);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 2px;
      transition: width 0.3s;
    }

    .progress-text {
      font-size: 0.75rem;
      color: var(--accent);
      font-weight: 600;
    }

    .module-arrow {
      font-size: 1.25rem;
      color: var(--text-muted);
      transition: transform 0.2s;
    }

    .module-card:hover .module-arrow {
      transform: translateX(4px);
      color: var(--primary-light);
    }

    .quick-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .quick-card {
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary);
        box-shadow: var(--shadow-sm);
      }
    }

    .quick-icon {
      font-size: 1.5rem;
      display: block;
      margin-bottom: 0.75rem;
    }

    .quick-card h4 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .quick-card p {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .quick-link {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-light);
    }
  `]
})
export class DashboardComponent {
  modules: LearningModule[];
  totalLessons: number;

  constructor(
    private dataService: LearningDataService,
    private advancedDataService: AdvancedLearningDataService,
    protected progress: ProgressService,
    protected i18n: I18nService
  ) {
    this.modules = [
      ...this.dataService.getModules(),
      ...this.advancedDataService.getAdvancedModules()
    ].sort((a, b) => a.order - b.order);
    this.totalLessons = this.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  }

  getModuleProgress(module: LearningModule): number {
    return this.progress.getModuleProgress(module.id, module.lessons.length);
  }
}
