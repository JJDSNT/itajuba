import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface ClubeClassificacao {
  nome: string;
  pontos: number;
  vitorias: number;
  derrotas: number;
}

@Component({
  selector: 'app-classificacao',
  imports: [CommonModule],
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao.component.css']
})
export class ClassificacaoComponent {
  @Input() classificacao: ClubeClassificacao[] = [];
}
