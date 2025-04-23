import { Component, OnInit } from '@angular/core';
import { CampeonatoService } from '../../services/campeonato.service';
import {
  PartidaModel,
  ClubeClassificacao,
  Rodada,
} from '../../models/campeonato.model';
import { PartidasListComponent } from '../../components/partidas-list/partidas-list.component';
import { ClassificacaoComponent } from '../../components/classificacao/classificacao.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [PartidasListComponent, ClassificacaoComponent],
})
export class HomeComponent implements OnInit {
  classificacao: ClubeClassificacao[] = [];
  partidas: PartidaModel[] = [];
  rodadas: Rodada[] = [];

  constructor(private readonly campeonatoService: CampeonatoService) {}

  ngOnInit(): void {
    console.log('[HomeComponent] Iniciando carregamento...');
  
    const partidas = this.campeonatoService.getPartidasCache();
    if (partidas) {
      console.log('[HomeComponent] Usando cache de partidas:', partidas.length);
      this.partidas = partidas;
    }
  
    const rodadas = this.campeonatoService.getRodadasCache();
    if (rodadas) {
      console.log('[HomeComponent] Usando cache de rodadas:', rodadas.length);
      this.rodadas = rodadas;
    } else {
      this.campeonatoService.getRodadas().subscribe((r) => {
        console.log('[HomeComponent] Rodadas recebidas:', r.length);
        this.rodadas = r;
      });
    }
  
    const classificacao = this.campeonatoService.getClassificacaoCache();
    if (classificacao) {
      console.log('[HomeComponent] Usando cache de classificação:', classificacao.length);
      this.classificacao = classificacao;
    } else {
      this.campeonatoService.getClassificacao().subscribe((c) => {
        console.log('[HomeComponent] Classificação recebida:', c.length);
        this.classificacao = c;
      });
    }
  }
  
  
}
