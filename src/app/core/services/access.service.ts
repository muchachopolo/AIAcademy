import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccessService {
  private readonly STORAGE_KEY = 'ai-academy-access';
  private readonly HASH = '5d41402abc4b2a76b9719d911017c592a5be36';

  readonly hasAccess = signal<boolean>(this.checkStored());

  private checkStored(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === this.HASH;
  }

  validatePassword(input: string): boolean {
    if (input.trim() === '5be36') {
      localStorage.setItem(this.STORAGE_KEY, this.HASH);
      this.hasAccess.set(true);
      return true;
    }
    return false;
  }
}
