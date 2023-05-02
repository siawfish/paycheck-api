import { Test, TestingModule } from '@nestjs/testing';
import { HelpRequestService } from './help-request.service';

describe('HelpRequestService', () => {
  let service: HelpRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpRequestService],
    }).compile();

    service = module.get<HelpRequestService>(HelpRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
