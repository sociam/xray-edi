import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidepanelComponent } from './slidepanel.component';

describe('SlidepanelComponent', () => {
  let component: SlidepanelComponent;
  let fixture: ComponentFixture<SlidepanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
