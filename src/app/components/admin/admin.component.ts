/**
 * Painel de Administração de Campeonatos
 *
 * Funcionalidades atuais:
 * - Acesso aos formulários de administração:
 *   - Criar Campeonato
 *   - Cadastrar Partida
 *   - Editar Partida
 * - Exibição condicional caso variáveis de ambiente não estejam configuradas (setup inicial)
 *
 * Observações futuras:
 * - Poderemos expandir este painel para:
 *   - Listar todos os formulários já criados no sistema
 *     - Exibir nome, tipo e links dos formulários cadastrados.
 *   - Verificar se cada formulário possui as permissões de acesso corretamente configuradas
 *     - Checar se estão privados
 *     - Checar quem são os editores autorizados
 *   - Exibir alertas no painel para formulários "pendentes de configuração"
 *     - Exemplo: ⚠️ Formulário sem restrição de acesso.
 *   - Permitir visualmente adicionar múltiplos administradores para cada formulário
 *     - Interface amigável para selecionar ou cadastrar novos emails autorizados.
 *   - (Opcional) Logar automaticamente eventos de configuração/alteração no painel para auditoria.
 *
 * Essas melhorias garantirão maior controle, segurança e facilidade de operação
 * conforme o sistema de campeonatos for crescendo.
 */

import { Component } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  criarCampeonatoUrl = environment.NG_APP_FORMULARIO_CAMPEONATO_URL || '';
  cadastrarPartidaUrl = ''; // Placeholder inicial
  editarPartidaUrl = '';    // Placeholder inicial

  get urlsValidas(): boolean {
    return this.criarCampeonatoUrl.trim() !== '';
  }
}
