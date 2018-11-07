import { TestBed, inject } from '@angular/core/testing';

import { ChatboxGuardService } from './chatbox-guard.service';

describe('ChatboxGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatboxGuardService]
    });
  });

  it('should be created', inject([ChatboxGuardService], (service: ChatboxGuardService) => {
    expect(service).toBeTruthy();
  }));
});
