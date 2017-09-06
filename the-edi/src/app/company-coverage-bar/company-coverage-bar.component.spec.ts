import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCoverageBarComponent } from './company-coverage-bar.component';

describe('CompanyCoverageBarComponent', () => {
  let component: CompanyCoverageBarComponent;
  let fixture: ComponentFixture<CompanyCoverageBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyCoverageBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCoverageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
