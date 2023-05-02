import { Test, TestingModule } from '@nestjs/testing';
import { PayChecksController } from './pay-checks.controller';

describe('PayChecksController', () => {
  let controller: PayChecksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayChecksController],
    }).compile();

    controller = module.get<PayChecksController>(PayChecksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
