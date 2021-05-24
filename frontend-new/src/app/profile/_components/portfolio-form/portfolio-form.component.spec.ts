import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioFormComponent } from './portfolio-form.component';

describe('PortofolioFormComponent', () => {
  let component: PortfolioFormComponent;
  let fixture: ComponentFixture<PortfolioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
