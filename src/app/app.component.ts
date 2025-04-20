import { ApplicationRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter, first, switchMap } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'itajuba';
  currentYear = new Date().getFullYear();

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
          console.log('Nova versão disponível. Recarregando...');
          document.location.reload();
        });
    }
  }
}
