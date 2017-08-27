import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInspectComponent } from './app-inspect.component';

describe('AppInspectComponent', () => {
  let component: AppInspectComponent;
  let fixture: ComponentFixture<AppInspectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppInspectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
