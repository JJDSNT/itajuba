import { Component } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent {
  criarCampeonatoUrl = environment.NG_APP_FORMULARIO_CAMPEONATO_URL || '';
  cadastrarPartidaUrl = ''; // Começa vazio, será preenchido depois
  editarPartidaUrl = '';    // Começa vazio, será preenchido depois

  get urlsValidas(): boolean {
    return this.criarCampeonatoUrl.trim() !== '';
  }
}
