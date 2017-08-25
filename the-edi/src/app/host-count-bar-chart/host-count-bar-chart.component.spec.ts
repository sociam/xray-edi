import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCountBarChartComponent } from './host-count-bar-chart.component';

describe('HostCountBarChartComponent', () => {
  let component: HostCountBarChartComponent;
  let fixture: ComponentFixture<HostCountBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostCountBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostCountBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
