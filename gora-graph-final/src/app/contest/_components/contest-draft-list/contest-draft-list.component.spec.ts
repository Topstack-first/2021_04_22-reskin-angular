import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestDraftListComponent } from './contest-draft-list.component';

describe('ContestDraftListComponent', () => {
  let component: ContestDraftListComponent;
  let fixture: ComponentFixture<ContestDraftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestDraftListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestDraftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
