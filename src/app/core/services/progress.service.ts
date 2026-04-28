import { Injectable, signal, computed } from '@angular/core';
import { UserProgress } from '../models/learning.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly STORAGE_KEY = 'ai-learning-progress';
  private progressMap = signal<Map<string, UserProgress>>(new Map());

  readonly completedCount = computed(() => {
    let count = 0;
    this.progressMap().forEach(p => { if (p.completed) count++; });
    return count;
  });

  constructor() {
    this.loadProgress();
  }

  private loadProgress() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const entries: [string, UserProgress][] = JSON.parse(stored);
      this.progressMap.set(new Map(entries));
    }
  }

  private saveProgress() {
    const entries = Array.from(this.progressMap().entries());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
  }

  markCompleted(moduleId: string, lessonId: string, quizScore?: number) {
    const key = `${moduleId}:${lessonId}`;
    const updated = new Map(this.progressMap());
    updated.set(key, {
      oduleId: moduleId,
      lessonId,
      completed: true,
      quizScore,
      lastAccessed: new Date()
    });
    this.progressMap.set(updated);
    this.saveProgress();
  }

  isCompleted(moduleId: string, lessonId: string): boolean {
    const key = `${moduleId}:${lessonId}`;
    return this.progressMap().get(key)?.completed ?? false;
  }

  getQuizScore(moduleId: string, lessonId: string): number | undefined {
    const key = `${moduleId}:${lessonId}`;
    return this.progressMap().get(key)?.quizScore;
  }

  getModuleProgress(moduleId: string, totalLessons: number): number {
    let completed = 0;
    this.progressMap().forEach((p, key) => {
      if (key.startsWith(moduleId + ':') && p.completed) completed++;
    });
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  }

  resetProgress() {
    this.progressMap.set(new Map());
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
