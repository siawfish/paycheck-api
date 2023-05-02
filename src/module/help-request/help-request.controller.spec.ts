import { Test, TestingModule } from '@nestjs/testing';
import { HelpRequestController } from './help-request.controller';

describe('HelpRequestController', () => {
  let controller: HelpRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpRequestController],
    }).compile();

    controller = module.get<HelpRequestController>(HelpRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
