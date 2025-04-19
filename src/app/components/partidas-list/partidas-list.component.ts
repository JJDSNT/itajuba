import { Component, Input } from '@angular/core';
import { PartidaModel } from '../../models/campeonato.model';
import { CommonModule } from '@angular/common';
import { PartidaCardComponent } from '../partida-card/partida-card.component';

@Component({
  selector: 'app-partidas-list',
  imports: [CommonModule,PartidaCardComponent],
  templateUrl: './partidas-list.component.html',
  styleUrls: ['./partidas-list.component.css'],
})
export class PartidasListComponent {
  @Input() partidas: PartidaModel[] = [];

  get partidasAgendadas(): PartidaModel[] {
    return this.partidas.filter((p) => p.status === 'agendada');
  }

  get partidasEncerradas(): PartidaModel[] {
    return this.partidas.filter((p) => p.status === 'encerrada');
  }
}
