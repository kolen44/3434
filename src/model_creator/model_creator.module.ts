import { ModelGenerationModule } from '@model_generation/model_generation';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicEntity } from 'src/db_models/technical/mechanic.entity';
import { UserEntity } from 'src/db_models/technical/user.entity';
import { GameEntity } from 'src/game/entities/game.entity';
import { ItemEntity } from 'src/items/entities/item.entity';
import { ItemsModule } from 'src/items/items.module';
import { ItemsService } from 'src/items/items.service';
import { LocationEntity } from 'src/locations/entities/location.entity';
import { LocationsModule } from 'src/locations/locations.module';
import { LocationsService } from 'src/locations/locations.service';
import { NpcEntity } from 'src/npcs/entities/npc.entity';
import { NpcsModule } from 'src/npcs/npcs.module';
import { NpcsService } from 'src/npcs/npcs.service';
import { QuestEntity } from 'src/quests/entities/quest.entity';
import { QuestsModule } from 'src/quests/quests.module';
import { QuestsService } from 'src/quests/quests.service';
import { ModelCreatorController } from './model_creator.controller';
import { ModelCreatorService } from './model_creator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LocationEntity,
      NpcEntity,
      QuestEntity,
      ItemEntity,
      UserEntity,
      GameEntity,
      MechanicEntity,
    ]),
    ModelGenerationModule,
    LocationsModule,
    NpcsModule,
    QuestsModule,
    ItemsModule,
    MechanicEntity,
  ],
  controllers: [ModelCreatorController],
  providers: [
    LocationsService,
    ModelCreatorService,
    NpcsService,
    QuestsService,
    ModelCreatorService,
    ItemsService,
  ],
})
export class ModelCreatorModule {}
