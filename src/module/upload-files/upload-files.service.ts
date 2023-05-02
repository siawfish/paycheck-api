import { Injectable } from '@nestjs/common';
import { PaymentsService } from 'src/module/payment-settings/payments.service';
import { VerifyType } from 'src/module/users/entities/users.entity';
import { UsersService } from 'src/module/users/users.service';
import { ObjectId } from 'mongodb';

import { KeyType, UploadFile } from './entities/upload-file.entity';

@Injectable()
export class UploadFilesService {
  constructor(private readonly userService: UsersService, private readonly paymentService: PaymentsService) {}
  async update(options: string, files: any, userId: string) {
    const ObjUpdate: any = {};
    Object.keys(files).reduce((total, currentValue) => {
      if (files[currentValue].length > 0) {
        ObjUpdate[currentValue + '_approval'] = VerifyType.PENDING;
        ObjUpdate[currentValue] = [...new Set(files[currentValue].map((file) => process.env.HOST + file.path))];
      }
      return null;
    }, 'start');

    switch (options) {
      case KeyType.PROFILE:
        return await this.userService.updateUser(userId, ObjUpdate);
      case KeyType.REGISTER:
        return await this.userService.updateUser(userId, ObjUpdate);
      case KeyType.PAYMENT:
        const payment = await this.paymentService.findOne({ user_id: ObjectId(userId) });
        return await this.paymentService.updatePayment(payment._id, ObjUpdate);
    }
  }

  async uploadFilesForAdmin(files: any) {
    const array_url = await this.convertArray(files[Object.keys(files)[0]]);
    const file_name = array_url[0].split('/');

    const result: UploadFile = {
      file_name: file_name[file_name.length - 1],
      file_url: array_url,
    };

    return result;
  }

  async convertArray(array: Array<Express.Multer.File>) {
    const file_url = [...new Set(array.map((file) => process.env.HOST + file.path))];

    return file_url;
  }
}
