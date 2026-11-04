import { Controller , Get , Logger, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready' };
    } catch (error: unknown) {
      this.logger.error(
        'Database readiness check failed',
        error instanceof Error ? error.stack : String(error),
      );

      throw new ServiceUnavailableException({
        status: 'not_ready',
        message: 'A required service is unavailable',
      });
    }
  }
}