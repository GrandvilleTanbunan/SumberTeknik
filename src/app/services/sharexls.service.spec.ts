import { TestBed } from '@angular/core/testing';

import { SharexlsService } from './sharexls.service';

describe('SharexlsService', () => {
  let service: SharexlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharexlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
