import { TestBed, inject } from '@angular/core/testing';

import { AppInfoTypesService } from './app-info-types.service';

describe('AppInfoTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppInfoTypesService]
    });
  });

  it('should be created', inject([AppInfoTypesService], (service: AppInfoTypesService) => {
    expect(service).toBeTruthy();
  }));
});
