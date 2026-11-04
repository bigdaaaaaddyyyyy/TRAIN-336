import { Controller, Get } from '@nestjs/common';
import { ProfessionsService } from './professions.service';

@Controller('api/professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Get()
  listActive() {
    return this.professionsService.listActive();
  }
}