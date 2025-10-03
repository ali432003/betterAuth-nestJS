import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import {auth} from './lib/auth'
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [AuthModule.forRoot({auth, disableGlobalAuthGuard: true}), DemoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
