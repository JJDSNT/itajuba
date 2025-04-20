import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import * as Papa from 'papaparse';
import { PartidaModel, ClubeClassificacao } from '../models/campeonato.model';

@Injectable({
  providedIn: 'root',
})
export class CampeonatoService {
  private csvUrl =
    'https://docs.google.com/spreadsheets/d/1xWApRoSOWaw_mPWIFiSI4jPp26xOpOIeDzfmxD-igA8/export?format=csv&id=1xWApRoSOWaw_mPWIFiSI4jPp26xOpOIeDzfmxD-igA8&gid=0';

  constructor(private http: HttpClient) {}

  getPartidas(): Observable<PartidaModel[]> {
    return new Observable((observer) => {
      this.http
        .get(this.csvUrl, { responseType: 'text' })
        .subscribe((csvData) => {
          const parsed = Papa.parse(csvData, { header: true });

          const partidas: PartidaModel[] = parsed.data.map(
            (row: any, index: number) => {
              const isWO =
                row['WO Mandante']?.toUpperCase() === 'WO' ||
                row['WO visitante']?.toUpperCase() === 'WO';

              const pontosMandanteRaw = row['Pontos Mandante']?.trim();
              const pontosVisitanteRaw = row['Pontos Visitante']?.trim();

              const encerrada =
                pontosMandanteRaw !== '' && pontosVisitanteRaw !== '';

              const pontosMandante = Number(pontosMandanteRaw);
              const pontosVisitante = Number(pontosVisitanteRaw);

              const status = isWO ? 'wo' : encerrada ? 'encerrada' : 'agendada';

              const campoNeutro = row['Campo Neutro?']?.trim();
              const local = campoNeutro ? campoNeutro : row['Clube Mandante'];

              const dataISO = this.toISODate(row['Data']);
              const dataFormatada = this.toFormattedDate(row['Data']);

              // 🔍 Log para debug
              console.log({
                linha: index + 1,
                data: row['Data'],
                mandante: row['Clube Mandante'],
                visitante: row['Clube Visitante'],
                pontosMandante: pontosMandanteRaw,
                pontosVisitante: pontosVisitanteRaw,
                isWO,
                encerrada,
                status,
                local,
              });

              return {
                id: String(index + 1).padStart(3, '0'),
                data: dataISO,
                dataFormatada,
                local,
                status,
                resultado: (encerrada || isWO)
                ? {
                    clubeCasa: row['Clube Mandante'],
                    pontosCasa: pontosMandante,
                    clubeVisitante: row['Clube Visitante'],
                    pontosVisitante: pontosVisitante,
                  }
                : undefined,
              };
            }
          );

          observer.next(partidas);
          observer.complete();
        });
    });
  }

  getClassificacao(): Observable<ClubeClassificacao[]> {
    return this.getPartidas().pipe(
      map((partidas) => {
        const ranking: Record<string, ClubeClassificacao> = {};

        const encerradas = partidas.filter(
          (p) => p.status === 'encerrada' && p.resultado
        );

        for (const partida of encerradas) {
          const { clubeCasa, clubeVisitante, pontosCasa, pontosVisitante } =
            partida.resultado!;

          for (const nome of [clubeCasa, clubeVisitante]) {
            if (!ranking[nome]) {
              ranking[nome] = { nome, pontos: 0, vitorias: 0, derrotas: 0 };
            }
          }

          if (pontosCasa > pontosVisitante) {
            ranking[clubeCasa].pontos += 3;
            ranking[clubeCasa].vitorias += 1;
            ranking[clubeVisitante].derrotas += 1;
          } else if (pontosVisitante > pontosCasa) {
            ranking[clubeVisitante].pontos += 3;
            ranking[clubeVisitante].vitorias += 1;
            ranking[clubeCasa].derrotas += 1;
          }
        }

        return Object.values(ranking).sort((a, b) => b.pontos - a.pontos);
      })
    );
  }


  private toISODate(input: string): string {
    const [dia, mes] = input.split('/');
    return `2025-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  private toFormattedDate(input: string): string {
    const [dia, mes] = input.split('/');
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/25`;
  }
}
