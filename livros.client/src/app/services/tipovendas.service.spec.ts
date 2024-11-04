import { TestBed } from '@angular/core/testing';

import { TipovendasService } from './tipovendas.service';

describe('TipovendasService', () => {
  let service: TipovendasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipovendasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
