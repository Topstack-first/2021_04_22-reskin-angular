import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesDialogComponent } from './challenges-dialog.component';

describe('ChallengesDialogComponent', () => {
  let component: ChallengesDialogComponent;
  let fixture: ComponentFixture<ChallengesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
