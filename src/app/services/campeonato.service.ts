import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, switchAll } from 'rxjs';
import * as Papa from 'papaparse';
import {
  ClubeInfo,
  PartidaModel,
  ClubeClassificacao,
  Rodada,
} from '../models/campeonato.model';

@Injectable({
  providedIn: 'root',
})
export class CampeonatoService {
  private readonly csvUrl =
    'https://docs.google.com/spreadsheets/d/1xWApRoSOWaw_mPWIFiSI4jPp26xOpOIeDzfmxD-igA8/export?format=csv&id=1xWApRoSOWaw_mPWIFiSI4jPp26xOpOIeDzfmxD-igA8&gid=0';
  private readonly clubesUrl =
    'https://docs.google.com/spreadsheets/d/1xWApRoSOWaw_mPWIFiSI4jPp26xOpOIeDzfmxD-igA8/export?format=csv&gid=29461594';

  private readonly csv$: Observable<string>;
  private readonly clubes$: Observable<ClubeInfo[]>;

  constructor(private readonly http: HttpClient) {
    this.csv$ = this.http
      .get(this.csvUrl, { responseType: 'text' })
      .pipe(shareReplay(1));

    this.clubes$ = this.http.get(this.clubesUrl, { responseType: 'text' }).pipe(
      map((csv) => {
        const parsed = Papa.parse(csv, { header: true });
        return (parsed.data as any[])
          .map((row) => ({
            nome: row['Clube']?.trim(),
            endereco: row['Endereço']?.trim(),
          }))
          .filter((c) => c.nome && c.endereco);
      }),
      shareReplay(1)
    );
  }

  getClubes(): Observable<ClubeInfo[]> {
    return this.clubes$;
  }

  getRodadas(): Observable<Rodada[]> {
    return this.getPartidas().pipe(
      map((partidas) => {
        const agrupadas = new Map<string, Rodada>();

        for (const partida of partidas) {
          if (!agrupadas.has(partida.data)) {
            agrupadas.set(partida.data, {
              data: partida.data,
              dataFormatada: partida.dataFormatada,
              jogos: [],
            });
          }

          agrupadas.get(partida.data)!.jogos.push({
            mandante: partida.clubeMandante,
            visitante: partida.clubeVisitante,
            pontosMandante: partida.resultado?.pontosCasa,
            pontosVisitante: partida.resultado?.pontosVisitante,
            local: partida.local,
            status: partida.status,
          });
        }

        return Array.from(agrupadas.values()).sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        );
      })
    );
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

          const mandante = partida.clubeMandante.trim();
          const visitante = partida.clubeVisitante.trim();
          const pontosMandante = partida.resultado.pontosCasa;
          const pontosVisitante = partida.resultado.pontosVisitante;

          // Inicializa os clubes no ranking
          for (const nome of [mandante, visitante]) {
            if (!ranking[nome]) {
              ranking[nome] = {
                nome,
                pontos: 0,
                saldoTecnico: 0,
              };
            }
          }

          // Soma os pontos oficiais da rodada
          ranking[mandante].pontos += pontosMandante;
          ranking[visitante].pontos += pontosVisitante;

          // Aplica o saldo técnico inferido com base apenas nos pontos ganhos
          const [saldoMandante, saldoVisitante] = this.inferirSaldoTecnico(
            pontosMandante,
            pontosVisitante
          );
          ranking[mandante].saldoTecnico += saldoMandante;
          ranking[visitante].saldoTecnico += saldoVisitante;
        }

        return ranking;
      }),
      map((ranking) =>
        this.getClubes().pipe(
          map((clubes) => {
            const enderecoMap = Object.fromEntries(
              clubes.map((c) => [c.nome.trim(), c.endereco])
            );
            return Object.values(ranking)
              .map((c) => ({
                ...c,
                endereco: enderecoMap[c.nome] ?? '',
              }))
              .sort((a, b) => b.pontos - a.pontos);
          })
        )
      ),
      switchAll()
    );
  }

  inferirSaldoTecnico(pontosMandante: number, pontosVisitante: number): [number, number] {
    if (pontosVisitante === 0) {
      return [0, 0];
    }
  
    return [-pontosVisitante, +pontosVisitante];
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
