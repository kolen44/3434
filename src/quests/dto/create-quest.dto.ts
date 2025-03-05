import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateQuestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Минимальная длина 5 символов' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Минимальная длина 3 символa' })
  meta: string;

  @IsBoolean()
  ended: boolean = false;
}
