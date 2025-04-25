import { Component } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  criarCampeonatoUrl = environment.NG_APP_ADMIN_FORM_CRIAR_CAMPEONATO;
  cadastrarPartidaUrl = environment.NG_APP_ADMIN_FORM_CADASTRAR_PARTIDA;
  editarPartidaUrl = environment.NG_APP_ADMIN_FORM_EDITAR_PARTIDA;
}
