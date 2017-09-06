import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreCompareObservatoryDiffComponent } from './genre-compare-observatory-diff.component';

describe('GenreCompareObservatoryDiffComponent', () => {
  let component: GenreCompareObservatoryDiffComponent;
  let fixture: ComponentFixture<GenreCompareObservatoryDiffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreCompareObservatoryDiffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreCompareObservatoryDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
