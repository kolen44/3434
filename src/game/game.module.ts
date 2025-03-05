import {
  ModelGenerationModule,
  ModelGenerationService,
} from '@model_generation/model_generation';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicEntity } from 'src/db_models/technical/mechanic.entity';
import { UserEntity } from 'src/db_models/technical/user.entity';
import { ItemEntity } from 'src/items/entities/item.entity';
import { ItemsModule } from 'src/items/items.module';
import { ItemsService } from 'src/items/items.service';
import { LocationEntity } from 'src/locations/entities/location.entity';
import { LocationsModule } from 'src/locations/locations.module';
import { LocationsService } from 'src/locations/locations.service';
import { ModelCreatorModule } from 'src/model_creator/model_creator.module';
import { ModelCreatorService } from 'src/model_creator/model_creator.service';
import { NpcEntity } from 'src/npcs/entities/npc.entity';
import { NpcsModule } from 'src/npcs/npcs.module';
import { NpcsService } from 'src/npcs/npcs.service';
import { QuestEntity } from 'src/quests/entities/quest.entity';
import { QuestsModule } from 'src/quests/quests.module';
import { QuestsService } from 'src/quests/quests.service';
import { GameEntity } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameEntity,
      UserEntity,
      MechanicEntity,
      ItemEntity,
      QuestEntity,
      NpcEntity,
      UserEntity,
      LocationEntity,
    ]),
    LocationsModule,
    ModelGenerationModule,
    ItemsModule,
    QuestsModule,
    NpcsModule,
    ModelCreatorModule,
  ],
  controllers: [GameController],
  providers: [
    LocationsService,
    GameService,
    ModelGenerationService,
    ItemsService,
    QuestsService,
    NpcsService,
    ModelCreatorService,
  ],
})
export class GameModule {}
