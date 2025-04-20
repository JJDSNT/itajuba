import { Component, Input } from '@angular/core';
import { PartidaModel } from '../../models/campeonato.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partida-card',
  imports: [CommonModule],
  templateUrl: './partida-card.component.html',
  styleUrls: ['./partida-card.component.css'],
})
export class PartidaCardComponent {
  @Input() partida!: PartidaModel;

  get ehExibivel(): boolean {
    return (
      (this.partida.status === 'encerrada' || this.partida.status === 'wo') &&
      !!this.partida.resultado
    );
  }

  get vencedor(): string | null {
    if (!this.ehExibivel || !this.partida.resultado) return null;

    const { pontosCasa, pontosVisitante, clubeCasa, clubeVisitante } =
      this.partida.resultado;

    if (pontosCasa > pontosVisitante) return clubeCasa;
    if (pontosVisitante > pontosCasa) return clubeVisitante;
    return 'Empate';
  }

  get ehWO(): boolean {
    return this.partida.status === 'wo';
  }
}
