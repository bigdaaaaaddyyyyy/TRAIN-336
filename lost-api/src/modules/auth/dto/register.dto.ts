import {
  IsByteLength,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CurrentFeel, JobLevel } from '../../../generated/prisma/enums';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(12)
  @IsByteLength(1, 72)
  password!: string;

  @IsUUID()
  professionId!: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  customProfession?: string;

  @IsEnum(CurrentFeel)
  currentFeel!: CurrentFeel;

  @IsEnum(JobLevel)
  jobLevel!: JobLevel;
}
