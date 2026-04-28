import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProgressService } from './core/services/progress.service';
import { I18nService } from './core/services/i18n.service';
import { AccessService } from './core/services/access.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  gateStep = signal<'pricing' | 'payment' | null>(null);
  selectedPlan = signal<string>('');
  passwordInput = signal<string>('');
  passwordError = signal<boolean>(false);

  constructor(
    protected progress: ProgressService,
    protected i18n: I18nService,
    protected access: AccessService
  ) {}

  selectPlan(plan: string) {
    this.selectedPlan.set(plan);
    this.gateStep.set('payment');
  }

  submitPassword() {
    if (this.access.validatePassword(this.passwordInput())) {
      this.passwordError.set(false);
    } else {
      this.passwordError.set(true);
    }
  }

  get showGate(): boolean {
    return !this.access.hasAccess();
  }
}
