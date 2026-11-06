import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../database/database.service';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterDto) {
    const email = data.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const profession = await this.prisma.profession.findFirst({
      where: { id: data.professionId, isActive: true },
      select: { id: true, name: true },
    });

    if (!profession) {
      throw new BadRequestException('Select a valid active profession');
    }

    const customProfession = data.customProfession?.trim() || null;
    if (profession.name !== 'Other' && customProfession) {
      throw new BadRequestException(
        'Custom profession can only be used with the Other option',
      );
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    try {
      return await this.prisma.user.create({
        data: {
          name: data.name.trim(),
          email,
          passwordHash,
          preference: {
            create: {
              profession: { connect: { id: profession.id } },
              customProfession:
                profession.name === 'Other' ? customProfession : null,
              currentFeel: data.currentFeel,
              jobLevel: data.jobLevel,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          preference: {
            select: {
              professionId: true,
              customProfession: true,
              currentFeel: true,
              jobLevel: true,
            },
          },
        },
      });
    } catch (error) {
      if (this.isEmailUniqueConstraintError(error)) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }

      throw error;
    }
  }

  private isEmailUniqueConstraintError(error: unknown): error is Error {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== 'P2002'
    ) {
      return false;
    }

    const target = error.meta?.target;
    if (Array.isArray(target)) {
      return target.includes('email');
    }

    return typeof target === 'string' && target.toLowerCase().includes('email');
  }
}
