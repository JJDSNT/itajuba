// 🏆 Classificação
export interface ClubeClassificacao {
  nome: string;
  pontos: number;
  vitorias: number;
  derrotas: number;
}

// 📊 Status de uma partida
export type PartidaStatus = 'agendada' | 'encerrada' | 'wo';

// 🎯 Resultado da partida individual
export interface ResultadoPartida {
  clubeCasa: string;
  pontosCasa: number;
  clubeVisitante: string;
  pontosVisitante: number;
}

// ⚔️ Partidas individuais (vinda da planilha CSV)
export interface PartidaModel {
  id: string;
  data: string; // formato ISO: '2025-04-20' → usado para ordenação/lógica
  dataFormatada: string; // formato exibido: '20/04/25' → usado no template
  local: string;
  status: PartidaStatus;
  clubeMandante: string;
  clubeVisitante: string;
  resultado?: ResultadoPartida;
}

// 🧩 Partida formatada para agrupamento em rodada
export interface JogoRodada {
  mandante: string;
  visitante: string;
  local: string;
  status: PartidaStatus;
  pontosMandante?: number;
  pontosVisitante?: number;
}

// 📅 Rodada agrupando os jogos de uma data
export interface Rodada {
  data: string; // ISO
  dataFormatada: string; // Visual
  jogos: JogoRodada[];
}
