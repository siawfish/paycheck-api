import { Test, TestingModule } from '@nestjs/testing';
import { TermOfServiceService } from './term-of-service.service';

describe('TermOfServiceService', () => {
  let service: TermOfServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TermOfServiceService],
    }).compile();

    service = module.get<TermOfServiceService>(TermOfServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
