import { TestBed, inject } from '@angular/core/testing';

import { SelectionTrackingService } from './selection-tracking.service';

describe('SelectionTrackingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionTrackingService]
    });
  });

  it('should be created', inject([SelectionTrackingService], (service: SelectionTrackingService) => {
    expect(service).toBeTruthy();
  }));
});
