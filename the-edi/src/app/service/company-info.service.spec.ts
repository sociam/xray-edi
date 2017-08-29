import { TestBed, inject } from '@angular/core/testing';

import { CompanyInfoService } from './company-info.service';

describe('CompanyInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyInfoService]
    });
  });

  it('should be created', inject([CompanyInfoService], (service: CompanyInfoService) => {
    expect(service).toBeTruthy();
  }));
});
