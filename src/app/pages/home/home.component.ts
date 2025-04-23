import { Component, inject } from '@angular/core';
import { CampeonatoService } from '../../services/campeonato.service';
import {
  PartidaModel,
  ClubeClassificacao,
  Rodada,
} from '../../models/campeonato.model';
import { PartidasListComponent } from '../../components/partidas-list/partidas-list.component';
import { ClassificacaoComponent } from '../../components/classificacao/classificacao.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [PartidasListComponent, ClassificacaoComponent, CommonModule],
})
export class HomeComponent {
  private readonly campeonatoService = inject(CampeonatoService);
  
  classificacao: ClubeClassificacao[] = [];
  partidas: PartidaModel[] = [];
  rodadas: Rodada[] = [];

  readonly preloadFinalizado$ = this.campeonatoService.preload$;

  onPreloadFinalizado(): void {
    this.partidas = this.campeonatoService.getPartidasCache() ?? [];
    this.rodadas = this.campeonatoService.getRodadasCache() ?? [];
    this.classificacao = this.campeonatoService.getClassificacaoCache() ?? [];
    console.log('[HomeComponent] Dados carregados:', {
      partidas: this.partidas.length,
      rodadas: this.rodadas.length,
      classificacao: this.classificacao.length,
    });
  }
}
