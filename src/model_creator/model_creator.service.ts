import { ModelGenerationService } from '@model_generation/model_generation';
import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MechanicEntity } from 'src/db_models/technical/mechanic.entity';
import { UserEntity } from 'src/db_models/technical/user.entity';
import { GameEntity } from 'src/game/entities/game.entity';
import { ItemEntity } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { LocationsService } from 'src/locations/locations.service';
import { NpcEntity } from 'src/npcs/entities/npc.entity';
import { NpcsService } from 'src/npcs/npcs.service';
import { QuestEntity } from 'src/quests/entities/quest.entity';
import { QuestsService } from 'src/quests/quests.service';
import { Repository } from 'typeorm';

@Injectable()
export class ModelCreatorService {
  constructor(
    @Inject(forwardRef(() => ModelGenerationService))
    private readonly modelGenerationService: ModelGenerationService,
    @Inject(forwardRef(() => QuestsService))
    private readonly questsService: QuestsService,
    @Inject(forwardRef(() => LocationsService))
    private readonly locationsService: LocationsService,
    @Inject(forwardRef(() => NpcsService))
    private readonly npcsService: NpcsService,
    @Inject(forwardRef(() => ItemsService))
    private readonly itemsService: ItemsService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(MechanicEntity)
    private readonly mechanicRepository: Repository<MechanicEntity>,
  ) {}

  async createNewGamePlace(count: number = 1) {
    try {
      const locationData = await this.modelGenerationService.createLocation();
      const createdLocation = await this.locationsService.create(locationData);

      const npcs: NpcEntity[] = [],
        quests: QuestEntity[] = [],
        items: ItemEntity[] = [];

      for (let i = 0; i < count; i++) {
        const npcData =
          await this.modelGenerationService.createNpc(locationData);
        const mechanicNpc = await this.modelGenerationService.createMechanic(
          'npc',
          npcData,
        );
        const createdNpcMechanic =
          await this.mechanicRepository.save(mechanicNpc);
        const createdNpc = await this.npcsService.create(
          npcData,
          createdNpcMechanic,
        );

        const enemyData =
          await this.modelGenerationService.createNpc(locationData);
        const mechanicEnemy = await this.modelGenerationService.createMechanic(
          'enemy',
          enemyData,
        );
        const createdEnemyMechanic =
          await this.mechanicRepository.save(mechanicEnemy);
        const createdEnemy = await this.npcsService.create(
          enemyData,
          createdEnemyMechanic,
          'enemy',
        );

        const questData =
          await this.modelGenerationService.createQuest(npcData);
        const createdQuest = await this.questsService.create(questData);
        const itemData = await this.modelGenerationService.createItem(npcData);
        const createdItem = await this.itemsService.create(itemData);

        const npc = await this.npcsService.findById(createdNpc.id);
        npc.quests.push(createdQuest);
        npc.items.push(createdItem);
        npc.location = createdLocation;
        createdEnemy.location = createdLocation;
        await this.npcsService.updateForRelations(npc);
        await this.npcsService.updateForRelations(createdEnemy);

        items.push(await this.itemsService.findById(createdItem.id));
        quests.push(await this.questsService.findById(createdQuest.id));
        npcs.push(await this.npcsService.findById(createdNpc.id));
        npcs.push(await this.npcsService.findById(createdEnemy.id));
        console.log(await this.npcsService.findById(createdNpc.id));
      }

      const updatedLocation = await this.locationsService.findById(
        createdLocation.id,
      );
      return { location: updatedLocation, npcs, quests, items };
    } catch (error) {
      console.log(
        'Найдена следующая ошибка в функции createLocationNpcs: ' + error,
      );
    }
  }

  async createPlaceFromTG(
    uuid: string,
    numberOfCharacters: number = 1,
    countOfLocations: number = 1,
  ) {
    const game = await this.createGame(uuid);
    for (let i = 0; i <= countOfLocations; i++) {
      const gamePlace = await this.createNewGamePlace(numberOfCharacters);

      if (gamePlace && 'location' in gamePlace) {
        game.locations.push(gamePlace.location);

        await this.updateGameForRelations(game);
      } else {
        return new BadGatewayException(
          'Ответ от AI не был получен в функции createPlaceFromTG',
        );
      }
    }
    return await this.updateGameForRelations(game);
  }

  async deletePlaceFromTg() {}

  private async findOrCreateUser(uuid: string) {
    let user = await this.userRepository.findOne({
      where: { user_id: uuid },
    });
    if (!user) {
      user = await this.userRepository.save({
        user_id: uuid,
        is_premium: false,
      });
    }
    return user;
  }

  public async findGamesOfUser(uuid: string) {
    const user = await this.findOrCreateUser(uuid);
    let game = await this.gameRepository.findOne({
      where: { user },
      relations: ['locations', 'user'],
    });
    if (!game) {
      return new NotFoundException(
        'Данная локация с таким идентификатором не найдена в функции findGameOfUser',
      );
    }
    return game;
  }

  public async createGame(uuid: string) {
    const user = await this.findOrCreateUser(uuid);
    const currentGame = await this.gameRepository.findOne({
      where: { user: { user_id: uuid } },
      relations: ['user', 'locations', 'locations.npcs'],
    });
    if (currentGame) return currentGame;
    const gameObject = {
      user,
      locations: [],
    };
    return await this.gameRepository.save(gameObject);
  }

  public async findGame(uuid: string) {
    const user = await this.findOrCreateUser(uuid);
    return await this.gameRepository.findOne({
      where: { user },
      relations: ['user', 'locations'],
    });
  }

  async updateGameForRelations(game: GameEntity) {
    return await this.gameRepository.save(game);
  }
}
