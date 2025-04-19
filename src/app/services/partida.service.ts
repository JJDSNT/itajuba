import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PartidaModel } from '../models/campeonato.model';

@Injectable({
  providedIn: 'root',
})
export class PartidaService {
  constructor() {}

  getPartidas(): Observable<PartidaModel[]> {
    const partidasMock: PartidaModel[] = [
      {
        id: '001',
        data: '2025-04-10T14:00:00Z',
        local: 'Clube Itajubá de Malha',
        status: 'encerrada',
        resultado: {
          clubeCasa: 'Itajubá',
          pontosCasa: 70,
          clubeVisitante: 'Mooca',
          pontosVisitante: 65,
        },
      },
      {
        id: '002',
        data: '2025-04-25T15:00:00Z',
        local: 'Clube Mooca',
        status: 'agendada',
      },
      {
        id: '003',
        data: '2025-04-12T10:00:00Z',
        local: 'Clube Centro',
        status: 'encerrada',
        resultado: {
          clubeCasa: 'Centro',
          pontosCasa: 80,
          clubeVisitante: 'Itajubá',
          pontosVisitante: 85,
        },
      },
      {
        id: '004',
        data: '2025-04-30T16:30:00Z',
        local: 'Clube Zona Sul',
        status: 'agendada',
      },
    ];

    return of(partidasMock);
  }
}
