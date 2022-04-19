import { extname } from 'path';

export const MulterConfig = {
  destination: './public/uploads',
  filename: (req: Request, file: any, cb: Function) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
};
