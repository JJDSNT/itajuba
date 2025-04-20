import { Component, OnInit } from '@angular/core';
import { CampeonatoService } from '../../services/campeonato.service';
import {
  PartidaModel,
  ClubeClassificacao,
} from '../../models/campeonato.model';
import { PartidasListComponent } from '../../components/partidas-list/partidas-list.component';
import { ClassificacaoComponent } from '../../components/classificacao/classificacao.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [PartidasListComponent, ClassificacaoComponent],
})
export class HomeComponent implements OnInit {
  classificacao: ClubeClassificacao[] = [];
  partidas: PartidaModel[] = [];

  constructor(private readonly campeonatoService: CampeonatoService) {}

  ngOnInit(): void {
    this.campeonatoService.getPartidas().subscribe(p => this.partidas = p);
    this.campeonatoService.getClassificacao().subscribe(c => this.classificacao = c);
  }
}
