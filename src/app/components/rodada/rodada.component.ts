import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JogoRodada } from '../../models/campeonato.model';
import { JogoRodadaCardComponent } from "../jogo-rodada-card/jogo-rodada-card.component";

@Component({
  selector: 'app-rodada',
  standalone: true,
  templateUrl: './rodada.component.html',
  styleUrls: ['./rodada.component.css'],
  imports: [CommonModule, JogoRodadaCardComponent],
})
export class RodadaComponent {
  @Input() dataFormatada!: string;
  @Input() jogos: JogoRodada[] = [];

  expandido = false;
}
