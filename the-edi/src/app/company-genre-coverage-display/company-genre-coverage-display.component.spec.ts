import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyGenreCoverageDisplayComponent } from './company-genre-coverage-display.component';

describe('CompanyGenreCoverageDisplayComponent', () => {
  let component: CompanyGenreCoverageDisplayComponent;
  let fixture: ComponentFixture<CompanyGenreCoverageDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyGenreCoverageDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyGenreCoverageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
