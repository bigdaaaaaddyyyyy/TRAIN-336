import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
})
export class ProfessionsModule {}