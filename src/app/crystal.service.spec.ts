import { TestBed } from '@angular/core/testing';

import { CrystalService } from './crystal.service';

describe('CrystalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrystalService = TestBed.get(CrystalService);
    expect(service).toBeTruthy();
  });
});
