import { IsAlphanumeric, IsNotEmpty, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
