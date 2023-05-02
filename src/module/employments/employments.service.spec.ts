import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentsService } from './employments.service';

describe('EmploymentsService', () => {
  let service: EmploymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmploymentsService],
    }).compile();

    service = module.get<EmploymentsService>(EmploymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
