import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';


@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Session() session: UserSession) {
    return session.user;
  }
}
