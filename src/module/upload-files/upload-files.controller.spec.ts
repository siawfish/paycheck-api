import { Test, TestingModule } from '@nestjs/testing';
import { UploadFilesController } from './upload-files.controller';
import { UploadFilesService } from './upload-files.service';

describe('UploadFilesController', () => {
  let controller: UploadFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadFilesController],
      providers: [UploadFilesService],
    }).compile();

    controller = module.get<UploadFilesController>(UploadFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
