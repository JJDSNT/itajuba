import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaCardComponent } from './partida-card.component';

describe('PartidaCardComponent', () => {
  let component: PartidaCardComponent;
  let fixture: ComponentFixture<PartidaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidaCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
