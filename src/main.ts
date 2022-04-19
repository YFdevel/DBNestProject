import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as expressHbs from 'express-handlebars';
import {join} from 'path';
import * as hbs from 'hbs';
import {AppModule} from './app.module';
import hbsHelper from "handlebars";

const PORT=process.env.PORT||3000;

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    // app.useStaticAssets(join(__dirname, '..', 'public'));
    app.useStaticAssets(join(__dirname, '..', 'public'), {
        prefix: '/public/',
    });
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.engine(
        'hbs', expressHbs.engine({
            layoutsDir: join(__dirname, '..', 'views/layouts'),
            defaultLayout: 'layout',
            extname: 'hbs',
        }),
    );
    hbs.registerPartials(__dirname + '/views/partials');
    const hbsHelper = require('handlebars');
    hbsHelper.registerHelper("lastToken", function(array) {
        return array[array.length-1].token;
    });

    app.setViewEngine('hbs');
    await app.listen(PORT,()=>{
        console.log(`Server is starting on port = ${PORT}`);
    });

}

bootstrap();
