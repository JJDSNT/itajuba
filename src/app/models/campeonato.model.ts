export interface ClubeClassificacao {
  nome: string;
  pontos: number;
  vitorias: number;
  derrotas: number;
}

export type PartidaStatus = 'agendada' | 'encerrada' | 'wo';

export interface ResultadoPartida {
  clubeCasa: string;
  pontosCasa: number;
  clubeVisitante: string;
  pontosVisitante: number;
}

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
