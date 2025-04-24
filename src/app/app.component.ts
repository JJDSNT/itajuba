import { ApplicationRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter, first, switchMap } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CampeonatoService } from './services/campeonato.service';
import { CommonModule } from '@angular/common';

enum SplashState {
  LoadingApp = 'loading-app',
  PreloadingData = 'preloading-data',
  UpdatingPWA = 'updating-pwa',
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'itajuba';
  currentYear = new Date().getFullYear();

  readonly SplashState = SplashState;
  splashState: SplashState | null = SplashState.LoadingApp;

  private readonly campeonato = inject(CampeonatoService);
  private readonly updates = inject(SwUpdate);
  private readonly appRef = inject(ApplicationRef);

  preloadFinalizado$ = this.campeonato.preload$;

  constructor() {
    // Atualização de versão PWA
    if (this.updates.isEnabled) {
      this.appRef.isStable
        .pipe(
          filter((stable) => stable),
          first(),
          switchMap(() => this.updates.versionUpdates),
          filter((event) => event.type === 'VERSION_READY')
        )
        .subscribe(() => {
          this.splashState = SplashState.UpdatingPWA;
          const splash = document.getElementById('splash-screen');
          const splashText = document.getElementById('splash-text');
          if (splash && splashText) {
            splashText.textContent = 'Nova versão disponível. Recarregando...';
            splash.classList.remove('fade-out');
            splash.style.display = 'flex';
          }
          setTimeout(() => document.location.reload(), 1000);
        });
    }

    // Início do preload de dados
    if (this.splashState !== SplashState.UpdatingPWA) {
      this.splashState = SplashState.PreloadingData;
    }

    this.campeonato.preloadDadosHome().subscribe();

    this.preloadFinalizado$.pipe(filter(Boolean), first()).subscribe(() => {
      if (this.splashState === SplashState.UpdatingPWA) return;
      this.splashState = null;
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 300);
      }
    });
  }
}
