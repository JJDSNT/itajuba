import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JogoRodada } from '../../models/campeonato.model';
import { CampeonatoService } from '../../services/campeonato.service';

@Component({
  selector: 'app-jogo-rodada-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jogo-rodada-card.component.html',
  styleUrls: ['./jogo-rodada-card.component.css'],
})
export class JogoRodadaCardComponent implements OnInit {
  @Input() jogo!: JogoRodada;

  endereco?: string;
  private readonly campeonatoService = inject(CampeonatoService);

  ngOnInit(): void {
    this.campeonatoService.getClubes().subscribe(clubes => {
      const clube = clubes.find(c => c.nome === this.jogo.mandante);
      this.endereco = clube?.endereco;
    });
  }

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

}
