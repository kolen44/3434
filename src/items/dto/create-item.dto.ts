import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateItemDto {
  @IsString()
  image_url: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Минимальная длина 2 символa' })
  name: string;

  @IsNotEmpty()
  @IsString()
  meta: string;

  @IsNotEmpty()
  @IsString()
  faction_id: string;
}
