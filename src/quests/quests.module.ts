import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestEntity } from './entities/quest.entity';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestEntity])],
  controllers: [QuestsController],
  providers: [QuestsService],
})
export class QuestsModule {}
