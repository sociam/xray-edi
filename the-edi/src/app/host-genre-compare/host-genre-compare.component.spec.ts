import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostGenreCompareComponent } from './host-genre-compare.component';

describe('HostGenreCompareComponent', () => {
  let component: HostGenreCompareComponent;
  let fixture: ComponentFixture<HostGenreCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostGenreCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostGenreCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
