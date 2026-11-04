import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class ProfessionsService {
  constructor(private readonly prisma: PrismaService) {}

  listActive() {
    return this.prisma.profession.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        category: true,
      },
    });
  }
}