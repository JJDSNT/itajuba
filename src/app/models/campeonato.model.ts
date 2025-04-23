export interface ClubeInfo {
  nome: string;
  endereco: string;
}

// 🏆 Classificação de clubes
export interface ClubeClassificacao {
  nome: string;
  pontos: number;
  saldoTecnico: number;
  endereco?: string;
}

// 📊 Status possível de uma partida
export type PartidaStatus = 'agendada' | 'encerrada' | 'wo';

// 🎯 Resultado completo (caso tenha sido encerrada ou WO)
export interface ResultadoPartida {
  clubeCasa: string;
  pontosCasa: number;
  clubeVisitante: string;
  pontosVisitante: number;
}

// ⚔️ Partida individual (extraída do CSV)
export interface PartidaModel {
  id: string;
  data: string;             // ISO: '2025-04-20' → ordenação
  dataFormatada: string;    // Visual: '20/04/25' → exibição
  local: string;
  status: PartidaStatus;
  clubeMandante: string;
  clubeVisitante: string;
  nderecoMandante?: string;
  resultado?: ResultadoPartida;
}

// 📍 Partida agrupada por rodada (pronta para exibição)
export interface JogoRodada {
  mandante: string;
  visitante: string;
  local: string;
  status: PartidaStatus;
  pontosMandante?: number;
  pontosVisitante?: number;
}

// 📅 Rodada (conjunto de jogos em uma data)
export interface Rodada {
  data: string;             // ISO
  dataFormatada: string;    // Visual
  jogos: JogoRodada[];
}
