import { Test } from '@nestjs/testing';
import { PrismaService } from '../../database/database.service';
import { ProfessionsService } from './professions.service';

describe('ProfessionsService', () => {
  let service: ProfessionsService;
  const findMany = vi.fn();

  beforeEach(async () => {
    findMany.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfessionsService,
        {
          provide: PrismaService,
          useValue: { profession: { findMany } },
        },
      ],
    }).compile();

    service = moduleRef.get(ProfessionsService);
  });

  it('returns only active professions with public fields in stable order', async () => {
    const professions = [
      {
        id: 'profession-id',
        name: 'Software Engineer',
        category: 'Technology',
      },
    ];
    findMany.mockResolvedValue(professions);

    await expect(service.listActive()).resolves.toBe(professions);
    expect(findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        category: true,
      },
    });
  });
});
