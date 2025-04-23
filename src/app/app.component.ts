import { ApplicationRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter, first, switchMap } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CampeonatoService } from './services/campeonato.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'itajuba';
  currentYear = new Date().getFullYear();

  private readonly campeonato = inject(CampeonatoService);
  private readonly updates = inject(SwUpdate);
  private readonly appRef = inject(ApplicationRef);

  constructor() {
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

          setTimeout(() => {
            document.location.reload();
          }, 1000);
        });
    }
  }

  ngOnInit(): void {
    const splash = document.getElementById('splash-screen');
    const splashText = document.getElementById('splash-text');

    if (splash && splashText) {
      splashText.textContent = 'Pré-carregando os dados...';

      console.log('[AppComponent] Iniciando preload de dados...');
      this.campeonato.preloadDadosHome().subscribe(() => {
        console.log('[AppComponent] Preload concluído. Removendo splash...');
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 300);
      });
    }
  }
}
