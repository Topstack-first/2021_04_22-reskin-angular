import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDraftListComponent } from './article-draft-list.component';

describe('ArticleDraftListComponent', () => {
  let component: ArticleDraftListComponent;
  let fixture: ComponentFixture<ArticleDraftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleDraftListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDraftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
