import { Component, Input } from '@angular/core';
import { PartidaModel, Rodada } from '../../models/campeonato.model';
import { CommonModule } from '@angular/common';
import { PartidaCardComponent } from '../partida-card/partida-card.component';
import { RodadaComponent } from '../rodada/rodada.component';

@Component({
  selector: 'app-partidas-list',
  standalone: true,
  imports: [CommonModule, PartidaCardComponent, RodadaComponent],
  templateUrl: './partidas-list.component.html',
  styleUrls: ['./partidas-list.component.css'],
})
export class PartidasListComponent {
  @Input() partidas: PartidaModel[] = [];
  @Input() rodadas: Rodada[] = [];
  @Input() quantidade: number = 3;

  private ordenarPorData(partidas: PartidaModel[], crescente: boolean): PartidaModel[] {
    return [...partidas].sort((a, b) =>
      crescente ? a.data.localeCompare(b.data) : b.data.localeCompare(a.data)
    );
  }

  get ultimasRodadas(): Rodada[] {
    return [...this.rodadas]
      .filter((rodada) =>
        rodada.jogos.every(
          (jogo) =>
            typeof jogo.pontosMandante === 'number' &&
            typeof jogo.pontosVisitante === 'number'
        )
      )
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 2);
  }

  get proximaRodada(): Rodada | null {
    const hoje = new Date().toISOString();

    return [...this.rodadas]
      .filter((rodada) =>
        rodada.jogos.some(
          (jogo) =>
            jogo.pontosMandante === undefined ||
            jogo.pontosVisitante === undefined
        ) && rodada.data >= hoje
      )
      .sort((a, b) => a.data.localeCompare(b.data))[0] ?? null;
  }

  get partidasAgendadas(): PartidaModel[] {
    return this.ordenarPorData(
      this.partidas.filter((p) => p.status === 'agendada'),
      true
    ).slice(0, this.quantidade);
  }

  get partidasEncerradas(): PartidaModel[] {
    return this.partidas
      .filter((p) => p.status === 'encerrada' || p.status === 'wo')
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, this.quantidade);
  }
}
