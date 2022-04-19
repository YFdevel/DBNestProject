import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}
    @Get()
    async sendMessage() {
        return await this.mailService.sendLogMessage('yf_dev_test@mail.ru');
    }
}
