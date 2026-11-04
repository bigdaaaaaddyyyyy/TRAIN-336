import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsByteLength(1, 72)
  password!: string;
}
