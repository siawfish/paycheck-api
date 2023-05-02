import { Test, TestingModule } from '@nestjs/testing';
import { BankTransferService } from './bank-transfer.service';

describe('BankTransferService', () => {
  let service: BankTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankTransferService],
    }).compile();

    service = module.get<BankTransferService>(BankTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
