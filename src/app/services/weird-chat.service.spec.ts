import { TestBed, inject } from '@angular/core/testing';

import { WeirdChatService } from './weird-chat.service';

describe('WeirdChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeirdChatService]
    });
  });

  it('should be created', inject([WeirdChatService], (service: WeirdChatService) => {
    expect(service).toBeTruthy();
  }));
});
