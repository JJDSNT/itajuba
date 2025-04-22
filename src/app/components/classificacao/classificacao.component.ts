import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClubeClassificacao } from '../../models/campeonato.model';



@Component({
  selector: 'app-classificacao',
  imports: [CommonModule],
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao.component.css']
})
export class ClassificacaoComponent {
  @Input() classificacao: ClubeClassificacao[] = [];
}
