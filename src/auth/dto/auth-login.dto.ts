import { IsAlphanumeric, IsNotEmpty, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
