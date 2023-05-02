import { Test, TestingModule } from '@nestjs/testing';
import { BankTransferController } from './bank-transfer.controller';

describe('BankTransferController', () => {
  let controller: BankTransferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankTransferController],
    }).compile();

    controller = module.get<BankTransferController>(BankTransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
