import { PartialType } from '@nestjs/mapped-types';
import { CreateModelCreatorDto } from './create-model_creator.dto';

export class UpdateModelCreatorDto extends PartialType(CreateModelCreatorDto) {}
