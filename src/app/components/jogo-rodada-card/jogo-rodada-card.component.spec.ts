import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JogoRodadaCardComponent } from './jogo-rodada-card.component';

describe('JogoRodadaCardComponent', () => {
  let component: JogoRodadaCardComponent;
  let fixture: ComponentFixture<JogoRodadaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JogoRodadaCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JogoRodadaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
