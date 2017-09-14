import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageTypeCulpritsComponent } from './usage-type-culprits.component';

describe('UsageTypeCulpritsComponent', () => {
  let component: UsageTypeCulpritsComponent;
  let fixture: ComponentFixture<UsageTypeCulpritsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageTypeCulpritsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageTypeCulpritsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
