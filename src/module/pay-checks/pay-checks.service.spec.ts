import { Test, TestingModule } from '@nestjs/testing';
import { PayChecksService } from './pay-checks.service';

describe('PayChecksService', () => {
  let service: PayChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayChecksService],
    }).compile();

    service = module.get<PayChecksService>(PayChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
