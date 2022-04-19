import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {PostEntity} from "../database/entities/post.entity";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

     sendLogMessage(addressTo: string) {
        return this.mailerService
            .sendMail({
                to: addressTo,
                subject: 'Создание нового комментария!',
                template: 'test',
            })
            .then((res) => {
                console.log('res', res);
            })
            .catch((err) => {
                console.log('err', err);
            });
    }

    updateLogMessage(addressTo: string, post:PostEntity) {

        return this.mailerService
            .sendMail({
                to: addressTo,
                subject: 'Обновление данных!',
                template: 'update',
                context: post
            })
            .then((res) => {
                console.log('res', res);
            })
            .catch((err) => {
                console.log('err', err);
            });
     }
}
