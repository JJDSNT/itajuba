import { Component, OnInit } from '@angular/core';
import { PartidaService } from '../../services/partida.service';
import { PartidaModel,ClubeClassificacao } from '../../models/campeonato.model';
import { PartidasListComponent } from '../../components/partidas-list/partidas-list.component';
import { ClassificacaoComponent } from '../../components/classificacao/classificacao.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [PartidasListComponent, ClassificacaoComponent],
})
export class HomeComponent implements OnInit {
  partidas: PartidaModel[] = [];

  constructor(private partidaService: PartidaService) {}

  ngOnInit(): void {
    this.partidaService.getPartidas().subscribe((data) => {
      this.partidas = data;
    });
  }
  classificacao: ClubeClassificacao[] = [
    { nome: 'Itajubá', pontos: 6, vitorias: 2, derrotas: 0 },
    { nome: 'Mooca', pontos: 3, vitorias: 1, derrotas: 1 },
    { nome: 'Centro', pontos: 0, vitorias: 0, derrotas: 2 },
  ];
}
