import { Test, TestingModule } from '@nestjs/testing';
import { CompanyFileController } from './company-file.controller';
import { CompanyFileService } from './company-file.service';

describe('CompanyFileController', () => {
  let controller: CompanyFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyFileController],
      providers: [CompanyFileService],
    }).compile();

    controller = module.get<CompanyFileController>(CompanyFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
