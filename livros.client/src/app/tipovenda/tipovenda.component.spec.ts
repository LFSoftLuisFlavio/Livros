import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipovendaComponent } from './tipovenda.component';

describe('TipovendaComponent', () => {
  let component: TipovendaComponent;
  let fixture: ComponentFixture<TipovendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipovendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipovendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
