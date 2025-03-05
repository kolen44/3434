import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import { MechanicEntity } from './db_models/technical/mechanic.entity';
import { UserEntity } from './db_models/technical/user.entity';
import { FactionEntity } from './faction/entities/faction.entity';
import { FactionModule } from './faction/faction.module';
import { GameEntity } from './game/entities/game.entity';
import { GameModule } from './game/game.module';
import { ItemEntity } from './items/entities/item.entity';
import { ItemsModule } from './items/items.module';
import { LocationEntity } from './locations/entities/location.entity';
import { LocationsModule } from './locations/locations.module';
import { ModelCreatorModule } from './model_creator/model_creator.module';
import { NpcEntity } from './npcs/entities/npc.entity';
import { NpcsModule } from './npcs/npcs.module';
import { QuestEntity } from './quests/entities/quest.entity';
import { QuestsModule } from './quests/quests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: true,
        entities: [
          GameEntity,
          LocationEntity,
          NpcEntity,
          QuestEntity,
          ItemEntity,
          FactionEntity,
          UserEntity,
          MechanicEntity,
        ],
      }),
      inject: [ConfigService],
    }),
    LocationsModule,
    QuestsModule,
    NpcsModule,
    ItemsModule,
    FactionModule,
    ModelCreatorModule,
    GameModule,
    CharactersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
