import { TestBed, inject } from '@angular/core/testing';

import { XrayAPIService } from './xray-api.service';

describe('XrayAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XrayAPIService]
    });
  });

  it('should be created', inject([XrayAPIService], (service: XrayAPIService) => {
    expect(service).toBeTruthy();
  }));
});
