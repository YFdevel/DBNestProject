import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export function FileName(req: any, file: Express.Multer.File, cb: Function) {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  cb(null, `${randomName}${extname(file.originalname)}`);
}

export const FileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(
      new HttpException(
        'Загружаемый файл должен быть изображением',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  cb(null, true);
};
