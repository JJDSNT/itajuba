import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private readonly onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public readonly online$ = this.onlineSubject.asObservable();

  constructor(private readonly zone: NgZone) {
    window.addEventListener('online', () =>
      this.zone.run(() => this.onlineSubject.next(true))
    );
    window.addEventListener('offline', () =>
      this.zone.run(() => this.onlineSubject.next(false))
    );
  }
}
