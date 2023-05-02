import { Test, TestingModule } from '@nestjs/testing';
import { CompanyFileService } from './company-file.service';

describe('CompanyFileService', () => {
  let service: CompanyFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyFileService],
    }).compile();

    service = module.get<CompanyFileService>(CompanyFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
