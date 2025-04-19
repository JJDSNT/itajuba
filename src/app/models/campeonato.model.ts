export interface ClubeClassificacao {
  nome: string;
  pontos: number;
  vitorias: number;
  derrotas: number;
}

export type PartidaStatus = 'agendada' | 'encerrada';

export interface ResultadoPartida {
  clubeCasa: string;
  pontosCasa: number;
  clubeVisitante: string;
  pontosVisitante: number;
}

export interface PartidaModel {
  id: string;
  data: string; // ou Date
  local: string;
  status: PartidaStatus;
  resultado?: ResultadoPartida;
}
