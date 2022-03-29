import { TestBed } from '@angular/core/testing';

import { GeolocateUserService } from './geolocate-user.service';

describe('GeolocateUserService', () => {
  let service: GeolocateUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocateUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
