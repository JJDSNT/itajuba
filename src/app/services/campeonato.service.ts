import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  map,
  Observable,
  shareReplay,
  startWith,
  of,
  switchMap,
  BehaviorSubject,
  tap,
  catchError,
} from 'rxjs';
import * as Papa from 'papaparse';
import {
  ClubeInfo,
  PartidaModel,
  ClubeClassificacao,
  Rodada,
} from '../models/campeonato.model';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class CampeonatoService {

  private readonly basePlanilhaUrl = environment.NG_APP_PLANILHA_URL;

  private gerarCsvUrl(gid: string): string {
    return `${this.basePlanilhaUrl}/export?format=csv&gid=${gid}`;
  }

  private readonly csvUrl = this.gerarCsvUrl(environment.NG_APP_GIDS.partidas);
  private readonly clubesUrl = this.gerarCsvUrl(environment.NG_APP_GIDS.clubes);
  private readonly formulariosUrl = this.gerarCsvUrl(
    environment.NG_APP_GIDS.formularios
  );

  private readonly csv$: Observable<string>;
  private readonly clubes$: Observable<ClubeInfo[]>;
  private preloadExecucao$: Observable<void> | null = null;
  private readonly preloadSubject = new BehaviorSubject<boolean>(false);
  readonly preload$ = this.preloadSubject.asObservable();

  private partidasCache!: PartidaModel[];
  private classificacaoCache!: ClubeClassificacao[];
  private rodadasCache!: Rodada[];

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

  preloadDadosHome(): Observable<void> {
    if (this.preloadExecucao$) return this.preloadExecucao$;

    this.preloadExecucao$ = this.getPartidas().pipe(
      tap((partidas) => (this.partidasCache = partidas)),
      switchMap(() => this.getRodadas()),
      tap((rodadas) => (this.rodadasCache = rodadas)),
      switchMap(() => this.getClassificacao()),
      tap((classificacao) => (this.classificacaoCache = classificacao)),
      tap(() => this.preloadSubject.next(true)),
      map(() => void 0),
      shareReplay(1)
    );

    return this.preloadExecucao$;
  }

  getPartidasCache(): PartidaModel[] | null {
    return this.partidasCache ?? null;
  }

  getClassificacaoCache(): ClubeClassificacao[] | null {
    return this.classificacaoCache ?? null;
  }

  getRodadasCache(): Rodada[] | null {
    return this.rodadasCache ?? null;
  }

  getClubes(): Observable<ClubeInfo[]> {
    return this.clubes$;
  }

  getRodadas(): Observable<Rodada[]> {
    if (this.rodadasCache) return of(this.rodadasCache);

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
    const cacheKey = 'partidas-cache-v1';
    const cacheRaw = localStorage.getItem(cacheKey);
    let cache: PartidaModel[] | null = null;

    try {
      cache = cacheRaw ? JSON.parse(cacheRaw) : null;
    } catch {
      cache = null;
    }

    const atualiza$ = this.csv$.pipe(
      map((csvData) => {
        const parsed = Papa.parse(csvData, { header: true });
        return parsed.data.map((row: any, index: number) => {
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
        });
      }),
      switchMap((partidas: PartidaModel[]) =>
        this.getClubes().pipe(
          map((clubes) => {
            const enderecoMap = Object.fromEntries(
              clubes.map((c) => [c.nome.trim(), c.endereco])
            );
            const enriquecidas = partidas.map((partida) => ({
              ...partida,
              enderecoMandante: enderecoMap[partida.clubeMandante.trim()] ?? '',
            }));
            localStorage.setItem(cacheKey, JSON.stringify(enriquecidas));
            return enriquecidas;
          })
        )
      ),
      shareReplay(1)
    );

    return cache
      ? atualiza$.pipe(
          startWith(cache),
          catchError(() => of(cache))
        )
      : atualiza$.pipe(catchError(() => of(cache ?? [])));
  }

  getClassificacao(): Observable<ClubeClassificacao[]> {
    if (this.classificacaoCache) return of(this.classificacaoCache);

    return this.getPartidas().pipe(
      map((partidas) => {
        const ranking: Record<string, ClubeClassificacao> = {};

        for (const partida of partidas) {
          if (!partida.resultado) continue;

          const mandante = partida.clubeMandante.trim();
          const visitante = partida.clubeVisitante.trim();
          const pontosMandante = partida.resultado.pontosCasa;
          const pontosVisitante = partida.resultado.pontosVisitante;

          for (const nome of [mandante, visitante]) {
            if (!ranking[nome]) {
              ranking[nome] = {
                nome,
                pontos: 0,
                saldoTecnico: 0,
              };
            }
          }

          ranking[mandante].pontos += pontosMandante;
          ranking[visitante].pontos += pontosVisitante;

          const [saldoMandante, saldoVisitante] = this.inferirSaldoTecnico(
            pontosMandante,
            pontosVisitante
          );
          ranking[mandante].saldoTecnico += saldoMandante;
          ranking[visitante].saldoTecnico += saldoVisitante;
        }

        return ranking;
      }),
      switchMap((ranking) =>
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
      )
    );
  }

  inferirSaldoTecnico(
    pontosMandante: number,
    pontosVisitante: number
  ): [number, number] {
    if (pontosVisitante === 0) return [0, 0];
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
