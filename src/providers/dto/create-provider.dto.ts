import { IsNotEmpty } from 'class-validator';

export class CreateProviderDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  urls: string[];
}
