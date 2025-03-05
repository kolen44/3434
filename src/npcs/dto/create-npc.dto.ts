import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNpcDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsString()
  name: string;

  @IsString()
  rank: string;

  @IsNotEmpty()
  @IsString()
  meta: string;

  @IsNotEmpty()
  @IsNumber()
  gold_amount: number = 0;

  @IsNotEmpty()
  @IsString()
  faction_id: string;

  @IsNotEmpty()
  @IsString()
  triggered_by: string;
}
