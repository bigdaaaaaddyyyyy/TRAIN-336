import { BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../database/database.service';
import { CurrentFeel, JobLevel } from '../../generated/prisma/enums';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  const findUnique = vi.fn();
  const findFirst = vi.fn();
  const create = vi.fn();

  const registerData: RegisterDto = {
    name: '  Ada Lovelace  ',
    email: '  ADA@example.com ',
    password: 'a-strong-password-123',
    professionId: 'profession-id',
    currentFeel: CurrentFeel.MOTIVATED,
    jobLevel: JobLevel.JUNIOR,
  };

  beforeEach(async () => {
    findUnique.mockReset();
    findFirst.mockReset();
    create.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique, create },
            profession: { findFirst },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it('creates a user and onboarding preferences with a hashed password', async () => {
    const publicUser = {
      id: 'user-id',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: new Date(),
      preference: {
        professionId: 'profession-id',
        customProfession: null,
        currentFeel: CurrentFeel.MOTIVATED,
        jobLevel: JobLevel.JUNIOR,
      },
    };
    findUnique.mockResolvedValue(null);
    findFirst.mockResolvedValue({ id: 'profession-id', name: 'Engineer' });
    create.mockResolvedValue(publicUser);

    await expect(service.register(registerData)).resolves.toBe(publicUser);

    expect(findUnique).toHaveBeenCalledWith({
      where: { email: 'ada@example.com' },
      select: { id: true },
    });
    expect(findFirst).toHaveBeenCalledWith({
      where: { id: 'profession-id', isActive: true },
      select: { id: true, name: true },
    });

    const createData = create.mock.calls[0][0].data;
    expect(createData.name).toBe('Ada Lovelace');
    expect(createData.email).toBe('ada@example.com');
    expect(await bcrypt.compare(registerData.password, createData.passwordHash))
      .toBe(true);
    expect(createData.preference.create).toEqual({
      profession: { connect: { id: 'profession-id' } },
      customProfession: null,
      currentFeel: CurrentFeel.MOTIVATED,
      jobLevel: JobLevel.JUNIOR,
    });
    expect(create.mock.calls[0][0].select).not.toHaveProperty('passwordHash');
  });

  it('rejects an already registered email', async () => {
    findUnique.mockResolvedValue({ id: 'existing-user-id' });

    await expect(service.register(registerData)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(findFirst).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects a missing or inactive profession', async () => {
    findUnique.mockResolvedValue(null);
    findFirst.mockResolvedValue(null);

    await expect(service.register(registerData)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it('only accepts a custom profession with the Other option', async () => {
    findUnique.mockResolvedValue(null);
    findFirst.mockResolvedValue({ id: 'profession-id', name: 'Engineer' });

    await expect(
      service.register({ ...registerData, customProfession: 'Architect' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('stores the custom profession when Other is selected', async () => {
    findUnique.mockResolvedValue(null);
    findFirst.mockResolvedValue({ id: 'profession-id', name: 'Other' });
    create.mockResolvedValue({});

    await service.register({
      ...registerData,
      customProfession: '  Architect  ',
    });

    expect(create.mock.calls[0][0].data.preference.create.customProfession).toBe(
      'Architect',
    );
  });
});
