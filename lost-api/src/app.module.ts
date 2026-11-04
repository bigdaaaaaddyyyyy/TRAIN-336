import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProfessionsModule } from './modules/professions/professions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    DatabaseModule,
    ProfessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
