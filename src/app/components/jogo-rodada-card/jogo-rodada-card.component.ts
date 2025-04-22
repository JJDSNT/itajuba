import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JogoRodada } from '../../models/campeonato.model';

@Component({
  selector: 'app-jogo-rodada-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jogo-rodada-card.component.html',
  styleUrls: ['./jogo-rodada-card.component.css'],
})
export class JogoRodadaCardComponent {
  @Input() jogo!: JogoRodada;

  get vencedorSimples(): string {
    if (
      this.jogo.pontosMandante === undefined ||
      this.jogo.pontosVisitante === undefined
    ) return '—';
  
    if (this.jogo.pontosMandante > this.jogo.pontosVisitante) {
      return this.jogo.mandante;
    } else if (this.jogo.pontosVisitante > this.jogo.pontosMandante) {
      return this.jogo.visitante;
    } else {
      return 'Empate';
    }
  }
  
  get pontosTextoSimples(): string {
    if (this.jogo.status === 'wo') {
      return '+3 pts';
    }
  
    if (
      this.jogo.pontosMandante === undefined ||
      this.jogo.pontosVisitante === undefined
    ) return '';
  
    return 'Pontuação definida'; // só placeholder
  }
  
}

