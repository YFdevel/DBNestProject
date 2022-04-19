import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';



@Controller()
export class AppController {


    @Get('profile') getProfile(@Request() req) {
        return req.user;
    }
    // @UseGuards(AuthGuard('local'))
    // @Post('auth/login')
    // async login(@Request() req) {
    //     return req.user;
    // }
    @Get()
   getHello():string {
        return "Hello";
    }
}

