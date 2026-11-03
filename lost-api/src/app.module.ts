import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import {HealthModule} from ".modules/health/health.module";
import {AuthModule} from './modules/auth/auth.module';
import {DatabaseModule} from './database/database.module';

@Module({
  imports: 
    [
     HealthModule,
     AuthModule,
     DatabaseModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
