import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from
      '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {MailController} from "./mail.controller";



@Module({
  imports: [
    MailerModule.forRoot({
       transport:  'smtps://yf_dev_test@mail.ru:7Tk6ZrnCfEkfETxtiCLF@smtp.mail.ru',
      defaults: {
        from: '"Yuriy" <yf_dev_test@mail.ru>',
      },
      template: {
        dir: join(__dirname, '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}