import { TestBed } from '@angular/core/testing';

import { EntityHomepageService } from './entity-homepage.service';

describe('EntityHomepageService', () => {
  let service: EntityHomepageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityHomepageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
