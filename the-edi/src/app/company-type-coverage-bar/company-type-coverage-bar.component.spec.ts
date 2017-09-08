import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTypeCoverageBarComponent } from './company-type-coverage-bar.component';

describe('CompanyAppCoverageBarComponent', () => {
  let component: CompanyTypeCoverageBarComponent;
  let fixture: ComponentFixture<CompanyTypeCoverageBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTypeCoverageBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTypeCoverageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
