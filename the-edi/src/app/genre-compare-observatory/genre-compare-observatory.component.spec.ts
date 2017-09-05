import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreCompareObservatoryComponent } from './genre-compare-observatory.component';

describe('GenreCompareObservatoryComponent', () => {
  let component: GenreCompareObservatoryComponent;
  let fixture: ComponentFixture<GenreCompareObservatoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreCompareObservatoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreCompareObservatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
