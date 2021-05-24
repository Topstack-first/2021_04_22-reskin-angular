import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestReadComponent } from './contest-read.component';

describe('ContestReadComponent', () => {
  let component: ContestReadComponent;
  let fixture: ComponentFixture<ContestReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestReadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
