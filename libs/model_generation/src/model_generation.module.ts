import { Module } from '@nestjs/common';
import { ModelGenerationService } from './model_generation.service';

@Module({
  providers: [ModelGenerationService],
  exports: [ModelGenerationService],
})
export class ModelGenerationModule {}
