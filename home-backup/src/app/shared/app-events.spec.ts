import { TestBed } from '@angular/core/testing';

import { AppEvents } from './app-events';

describe('AppEvents', () => {
  let service: AppEvents;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppEvents);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
