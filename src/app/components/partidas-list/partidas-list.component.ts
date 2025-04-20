import { Component, Input } from '@angular/core';
import { PartidaModel } from '../../models/campeonato.model';
import { CommonModule } from '@angular/common';
import { PartidaCardComponent } from '../partida-card/partida-card.component';

@Component({
  selector: 'app-partidas-list',
  imports: [CommonModule, PartidaCardComponent],
  templateUrl: './partidas-list.component.html',
  styleUrls: ['./partidas-list.component.css'],
})
export class PartidasListComponent {
  @Input() partidas: PartidaModel[] = [];
  @Input() quantidade: number = 3; // 🔧 futuro: ajustar dinamicamente

  private ordenarPorData(
    partidas: PartidaModel[],
    crescente: boolean
  ): PartidaModel[] {
    return [...partidas].sort((a, b) =>
      crescente ? a.data.localeCompare(b.data) : b.data.localeCompare(a.data)
    );
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
      .slice(0, this.quantidade); // ou 3 diretamente se preferir
  }
}
