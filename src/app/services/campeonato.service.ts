import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import * as Papa from 'papaparse';
import { PartidaModel, ClubeClassificacao } from '../models/campeonato.model';

@Injectable({
  providedIn: 'root',
})
export class CampeonatoService {
  private readonly csvUrl =
    'https://docs.google.com/spreadsheets/d/1xWApRoSOWaw_mPWIFiSI4jPp26xOpOIeDzfmxD-igA8/export?format=csv&id=1xWApRoSOWaw_mPWIFiSI4jPp26xOpOIeDzfmxD-igA8&gid=0';

  private readonly csv$: Observable<string>;

  constructor(private readonly http: HttpClient) {
    this.csv$ = this.http
      .get(this.csvUrl, { responseType: 'text' })
      .pipe(shareReplay(1));
  }

  getPartidas(): Observable<PartidaModel[]> {
    return new Observable((observer) => {
      this.csv$.subscribe((csvData) => {
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

            let status: 'wo' | 'encerrada' | 'agendada';
            if (isWO) {
              status = 'wo';
            } else if (encerrada) {
              status = 'encerrada';
            } else {
              status = 'agendada';
            }

            const campoNeutro = row['Campo Neutro?']?.trim();
            const local = campoNeutro || row['Clube Mandante'];

            const dataISO = this.toISODate(row['Data']);
            const dataFormatada = this.toFormattedDate(row['Data']);

            return {
              id: String(index + 1).padStart(3, '0'),
              data: dataISO,
              dataFormatada,
              local,
              status,
              clubeMandante: row['Clube Mandante'],
              clubeVisitante: row['Clube Visitante'],
              resultado:
                encerrada || isWO
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
  
        for (const partida of partidas) {
          if (!partida.resultado) continue;
  
          const { clubeCasa, pontosCasa, clubeVisitante, pontosVisitante } = partida.resultado;
  
          for (const nome of [clubeCasa, clubeVisitante]) {
            if (!ranking[nome]) {
              ranking[nome] = { nome, pontos: 0, vitorias: 0, derrotas: 0 };
            }
          }
  
          // Soma os pontos
          ranking[clubeCasa].pontos += pontosCasa;
          ranking[clubeVisitante].pontos += pontosVisitante;
  
          // Determina vitória e derrota (desempate, apenas informativo)
          if (pontosCasa > pontosVisitante) {
            ranking[clubeCasa].vitorias += 1;
            ranking[clubeVisitante].derrotas += 1;
          } else if (pontosVisitante > pontosCasa) {
            ranking[clubeVisitante].vitorias += 1;
            ranking[clubeCasa].derrotas += 1;
          }
          // empates não contam como vitória ou derrota
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
