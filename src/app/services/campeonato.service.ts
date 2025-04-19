import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { PartidaModel, ClubeClassificacao } from '../models/campeonato.model';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoService {

  constructor() {}

  getPartidas(): Observable<PartidaModel[]> {
    const partidasMock: PartidaModel[] = [
      {
        id: '001',
        data: '2025-04-10',
        local: 'Clube Itajubá de Malha',
        status: 'encerrada',
        resultado: {
          clubeCasa: 'Itajubá',
          pontosCasa: 70,
          clubeVisitante: 'Mooca',
          pontosVisitante: 65
        }
      },
      {
        id: '002',
        data: '2025-04-12',
        local: 'Clube Centro',
        status: 'encerrada',
        resultado: {
          clubeCasa: 'Centro',
          pontosCasa: 80,
          clubeVisitante: 'Itajubá',
          pontosVisitante: 85
        }
      },
      {
        id: '003',
        data: '2025-04-25',
        local: 'Clube Mooca',
        status: 'agendada'
      }
    ];

    return of(partidasMock);
  }

  getClassificacao(): Observable<ClubeClassificacao[]> {
    return this.getPartidas().pipe(
      map(partidas => {
        const ranking: Record<string, ClubeClassificacao> = {};

        const encerradas = partidas.filter(p => p.status === 'encerrada' && p.resultado);

        for (const partida of encerradas) {
          const { clubeCasa, clubeVisitante, pontosCasa, pontosVisitante } = partida.resultado!;

          // Inicializa clubes
          for (const nome of [clubeCasa, clubeVisitante]) {
            if (!ranking[nome]) {
              ranking[nome] = { nome, pontos: 0, vitorias: 0, derrotas: 0 };
            }
          }

          // Aplica resultado
          if (pontosCasa > pontosVisitante) {
            ranking[clubeCasa].pontos += 3;
            ranking[clubeCasa].vitorias += 1;
            ranking[clubeVisitante].derrotas += 1;
          } else if (pontosVisitante > pontosCasa) {
            ranking[clubeVisitante].pontos += 3;
            ranking[clubeVisitante].vitorias += 1;
            ranking[clubeCasa].derrotas += 1;
          }
          // Se empates forem válidos:
          // else {
          //   ranking[clubeCasa].pontos += 1;
          //   ranking[clubeVisitante].pontos += 1;
          // }
        }

        return Object.values(ranking).sort((a, b) => b.pontos - a.pontos);
      })
    );
  }
}
