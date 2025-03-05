import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Минимальная длина 5 символов' })
  image_url: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Минимальная длина 3 символa' })
  name: string;

  @IsNotEmpty()
  @IsString()
  meta: string;

  @IsNotEmpty()
  @IsString()
  faction_id: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @IsString()
  altitude: string;

  @IsString()
  triggered_by: string;
}
