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

  get ehEncerrada(): boolean {
    return this.partida.status === 'encerrada';
  }

  get vencedor(): string | null {
    if (!this.ehEncerrada || !this.partida.resultado) return null;

    const { pontosCasa, pontosVisitante, clubeCasa, clubeVisitante } =
      this.partida.resultado;
    if (pontosCasa > pontosVisitante) return clubeCasa;
    if (pontosVisitante > pontosCasa) return clubeVisitante;
    return 'Empate';
  }
}
