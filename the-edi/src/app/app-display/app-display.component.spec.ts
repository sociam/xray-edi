import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDisplayComponent } from './app-display.component';

describe('AppDisplayComponent', () => {
  let component: AppDisplayComponent;
  let fixture: ComponentFixture<AppDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
