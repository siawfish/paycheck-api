import { Test, TestingModule } from '@nestjs/testing';
import { TermOfServiceController } from './term-of-service.controller';

describe('TermOfServiceController', () => {
  let controller: TermOfServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TermOfServiceController],
    }).compile();

    controller = module.get<TermOfServiceController>(TermOfServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
