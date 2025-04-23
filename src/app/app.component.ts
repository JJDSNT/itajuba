import { ApplicationRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter, first, switchMap } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CampeonatoService } from './services/campeonato.service';
import { CommonModule } from '@angular/common';

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

  private readonly campeonato = inject(CampeonatoService);
  private readonly updates = inject(SwUpdate);
  private readonly appRef = inject(ApplicationRef);

  preloadFinalizado$ = this.campeonato.preload$;

  constructor() {
    // PWA updates
    if (this.updates.isEnabled) {
      this.appRef.isStable
        .pipe(
          filter((stable) => stable),
          first(),
          switchMap(() => this.updates.versionUpdates),
          filter((event) => event.type === 'VERSION_READY')
        )
        .subscribe(() => {
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

    // Inicia preload
    this.campeonato.preloadDadosHome().subscribe();

    // Remove splash quando preload finalizar
    this.preloadFinalizado$.pipe(filter(Boolean), first()).subscribe(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 300);
      }
    });
  }
}
