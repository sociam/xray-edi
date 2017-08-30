import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCompanyDonutComponent } from './host-company-donut.component';

describe('HostCompanyDonutComponent', () => {
  let component: HostCompanyDonutComponent;
  let fixture: ComponentFixture<HostCompanyDonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostCompanyDonutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostCompanyDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
