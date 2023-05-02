import { Controller, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KeyAdmin, KeyType } from './entities/upload-file.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiFiles, DiskStorage, FileFields, DiskStorageAdmin, ApiFilesAdmin } from 'src/decorators/upaloadFiles.decorator';

import { CheckPolicies } from 'src/decorators/polices.decorator';
import { Action, AppAbility } from '../casl/casl-ability.factory';
import { User } from '../users/entities/users.entity';
import { PoliciesGuard } from '../auth/guards/policies.guard';

@ApiTags('Upload-Files')
@UseGuards(PoliciesGuard)
@Controller('upload-files')
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}
  @ApiBearerAuth()
  @ApiFiles()
  @ApiQuery({
    name: 'key',
    enum: KeyType,
    description: 'Choose according to the purpose of saving files',
  })
  @ApiOperation({ summary: `upload-files function for users, used in {register, users, payment}` })
  @Post()
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @UseInterceptors(FileFieldsInterceptor(FileFields(), DiskStorage))
  uploadFiles(@UploadedFiles() files: any, @Query('key') option: KeyType, @Req() req: any) {
    return this.uploadFilesService.update(option, files, req.user._id);
  }

  @ApiBearerAuth()
  @ApiFilesAdmin()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @ApiOperation({ summary: `upload-files function for admin, used in {invoice, bank-transfer, pay-check}` })
  @Post('/admin')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: KeyAdmin.INVOICE }, { name: KeyAdmin.BANKTRANSFER }, { name: KeyAdmin.PAYCHECK }, { name: KeyAdmin.COMPANY }],
      DiskStorageAdmin,
    ),
  )
  uploadFilesAdmin(@UploadedFiles() files: any) {
    return this.uploadFilesService.uploadFilesForAdmin(files);
  }
}
