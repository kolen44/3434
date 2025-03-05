import { Module } from '@nestjs/common';
import { FactionService } from './faction.service';
import { FactionController } from './faction.controller';

@Module({
  controllers: [FactionController],
  providers: [FactionService],
})
export class FactionModule {}
