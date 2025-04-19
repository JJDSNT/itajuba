import { Component, OnInit } from '@angular/core';
import { PartidaService } from '../../services/partida.service';
import { PartidaModel } from '../../models/partida.model';
import { PartidasListComponent } from "../../components/partidas-list/partidas-list.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [PartidasListComponent],
})
export class HomeComponent implements OnInit {
  partidas: PartidaModel[] = [];

  constructor(private partidaService: PartidaService) {}

  ngOnInit(): void {
    this.partidaService.getPartidas().subscribe((data) => {
      this.partidas = data;
    });
  }
}
