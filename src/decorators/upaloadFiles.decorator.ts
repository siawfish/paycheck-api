import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterField, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FieldNameOfFileType } from 'src/module/upload-files/entities/upload-file.entity';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { v4 as uuidv6 } from 'uuid';
import { storage } from 'src/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function ApiFilesBody() {
  const properties = {};
  Object.keys(FieldNameOfFileType).forEach(function (value) {
    if (value.slice(-1) === 's') {
      properties[value] = {
        type: 'array', // 👈  array of files
        items: {
          type: 'string',
          format: 'binary',
        },
      };
    } else {
      properties[value] = {
        type: 'file',
        format: 'binary',
      };
    }
  });
  return properties;
}

export function ApiFiles() {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file')),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: ApiFilesBody(),
      },
    }),
  );
}

export function ApiFilesAdmin() {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file')),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          invoice: {
            type: 'string',
            format: 'binary',
          },
          bank_transfer: {
            type: 'string',
            format: 'binary',
          },
          pay_check: {
            type: 'string',
            format: 'binary',
          },
          company: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export const DiskStorage: MulterOptions = {
  limits: {
    fileSize: 10240000,
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      const user: any = req.user;
      const id: string = uuidv6();

      // upload file to firebase
      const storageRef = ref(storage, process.env.PATH_IMAGE + '/' + user._id + '/' + file.fieldname + '/' + id + '/' + file.originalname);
      console.log('about to upload');
      uploadBytes(storageRef, file.buffer).then((snapshot) => {
        const httpsReference = getDownloadURL(snapshot.ref);
        httpsReference.then((url) => {
          console.log('File available at========>', url);
          cb(null, url);
        });
      });
    },
    filename: (req, files, cb) => {
      cb(null, files.originalname);
    },
  }),
};

export const DiskStorageAdmin: MulterOptions = {
  limits: {
    fileSize: 10240000,
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      const id: string = uuidv6();
      // upload file to firebase
      const storageRef = ref(storage, process.env.PATH_PAYMENT + '/' + file.fieldname + '/' + id + '/' + file.originalname);
      uploadBytes(storageRef, file.buffer).then((snapshot) => {
        const httpsReference = getDownloadURL(snapshot.ref);
        httpsReference.then((url) => {
          console.log('File available at', url);
          cb(null, url);
        });
      });
    },
    filename: (req, files, cb) => {
      cb(null, files.originalname);
    },
  }),
};

export function FileFields(): MulterField[] {
  const MulterField = [];
  Object.keys(FieldNameOfFileType).forEach(function (currentValue) {
    MulterField.push({ name: currentValue });
  });

  return MulterField;
}
