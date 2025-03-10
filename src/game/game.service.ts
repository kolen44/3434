import { ModelGenerationService } from '@model_generation/model_generation';
import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MechanicEntity } from 'src/db_models/technical/mechanic.entity';
import { UserEntity } from 'src/db_models/technical/user.entity';
import { ItemsService } from 'src/items/items.service';
import { LocationsService } from 'src/locations/locations.service';
import { ModelCreatorService } from 'src/model_creator/model_creator.service';
import { NpcEntity } from 'src/npcs/entities/npc.entity';
import { NpcsService } from 'src/npcs/npcs.service';
import { QuestsService } from 'src/quests/quests.service';
import { Repository } from 'typeorm';
import { GameEntity } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(NpcEntity)
    private readonly heroRepository: Repository<NpcEntity>,
    @Inject(forwardRef(() => ModelGenerationService))
    private readonly modelGenerationService: ModelGenerationService,
    @Inject(forwardRef(() => ItemsService))
    private readonly itemsService: ItemsService,
    @Inject(forwardRef(() => QuestsService))
    private readonly questsService: QuestsService,
    @Inject(forwardRef(() => NpcsService))
    private readonly npcsService: NpcsService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => ModelCreatorService))
    private readonly modelService: ModelCreatorService,
    @Inject(forwardRef(() => LocationsService))
    private readonly locationService: LocationsService,
  ) {}

  async delete(id: number) {
    const game = await this.findById(id);
    if (!game)
      return new UnauthorizedException(
        'Проверьте данные игры , так как сервер не может ее найти',
      );
    return this.gameRepository.delete(game.id);
  }

  async update(id: number, updateGameDto) {
    const game = await this.findById(id);
    if (!game)
      return new UnauthorizedException(
        'Проверьте данные игры , так как сервер не может ее найти',
      );
    return this.gameRepository.update(game.id, updateGameDto);
  }

  async findById(id: number) {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['npcs', 'game'],
    });
    if (!game) throw new NotFoundException('Данной игры не найдено');
    return game;
  }

  private async findOne(id) {
    const existGame = await this.gameRepository.findOne({
      where: { id },
    });

    return existGame;
  }

  async updateForRelations(updateGameDto) {
    const game = await this.findById(updateGameDto.id);
    if (!game)
      return new UnauthorizedException(
        'Проверьте данные игры , так как сервер не может его найти',
      );
    return await this.gameRepository.save(updateGameDto);
  }

  async createHero(uuid: string) {
    const createHeroDto = await this.modelGenerationService.createNpc();
    const mechanic: MechanicEntity =
      await this.modelGenerationService.createMechanic('hero', createHeroDto);
    const user = await this.findOrCreateUser(uuid);

    const newHeroObject = {
      type: 'hero',
      url: createHeroDto.url,
      meta: createHeroDto.meta,
      name: createHeroDto.name,
      items: [],
      user,
    };

    const newHero = await this.heroRepository.save(newHeroObject);

    const itemData =
      await this.modelGenerationService.createItem(newHeroObject);
    const createdItem = await this.itemsService.create(itemData);

    const hero = await this.npcsService.findById(newHero.id);
    hero.items.push(createdItem);
    hero.mechanic = mechanic;
    return await this.npcsService.updateForRelations(hero);
  }

  async takeCurrentHero(uuid: string, value: boolean = true) {
    const currentHero = await this.heroRepository.findOne({
      where: { user: { user_id: uuid } },
      relations: ['user', 'location', 'mechanic'],
    });
    currentHero.current = value;
    return this.heroRepository.save(currentHero);
  }

  async updateCharacterByLocation(updatedLocation) {
    const currentLocation = await this.locationService.findById(
      updatedLocation.id,
    );
    if (!currentLocation)
      throw new BadGatewayException('Данный герой не найден, ошибка сервера');
    return this.locationService.updateForRelations(updatedLocation);
  }

  async createEnemy() {
    const createEnemyDto = await this.modelGenerationService.createNpc();
    const mechanic: MechanicEntity =
      await this.modelGenerationService.createMechanic('enemy', createEnemyDto);

    const newEnemyObject = {
      url: createEnemyDto.url,
      meta: createEnemyDto.meta,
      type: 'enemy',
      faction_id: createEnemyDto.faction_id,
      name: createEnemyDto.name,
      items: [],
      mechanic,
    };

    const newEnemy = await this.heroRepository.save(newEnemyObject);

    return newEnemy;
  }

  async startGame(
    uuid: string,
    numberOfCharacters: number = 1,
    numberOfLocations: number = 1,
  ) {
    const currentGame = await this.findGame(uuid);
    if (currentGame) return currentGame;
    await this.createHero(uuid);
    const hero = await this.takeCurrentHero(uuid);
    const game = await this.modelService.createPlaceFromTG(
      uuid,
      numberOfCharacters,
      numberOfLocations,
    );
    if (game && 'locations' in game) {
      hero.location = await this.locationService.findById(game.locations[0].id);
      game.locations[0].npcs.push(hero);
      await this.updateCharacterByLocation(game.locations[0]);
      return await this.modelService.updateGameForRelations(game);
    }
  }

  async hitLogic(uuid: string, enemyId?: number) {
    const currentGame = await this.findGame(uuid);

    if (
      !currentGame ||
      !currentGame.locations ||
      currentGame.locations.length === 0
    ) {
      throw new NotFoundException('Игра или локации не найдены');
    }

    const currentLocation = currentGame.locations.find((location) =>
      location.npcs.some((npc) => npc.type === 'hero' && npc.current),
    );

    if (!currentLocation) {
      throw new NotFoundException('Герой не найден ни в одной локации');
    }

    const hero = currentLocation.npcs.find(
      (npc) => npc.type === 'hero' && npc.current,
    );

    if (!hero) {
      throw new NotFoundException('Герой не найден в текущей локации');
    }

    const enemies = currentLocation.npcs.filter((npc) => npc.type === 'enemy');

    if (enemies.length === 0) {
      throw new NotFoundException('Враги не найдены в текущей локации.');
    }

    let finalText = '';

    let targetEnemies = enemies;
    if (enemyId !== -1) {
      targetEnemies = enemies.filter((enemy) => enemy.id === enemyId);
      if (targetEnemies.length === 0) {
        throw new NotFoundException(
          'Выбранный враг не найден в текущей локации.',
        );
      }
    }

    // Герой атакует выбранного врага (или всех если враг не указан)
    targetEnemies.forEach((enemy) => {
      if (enemy.mechanic && hero.mechanic) {
        enemy.mechanic.hp -= hero.mechanic.damage;
        if (enemy.mechanic.hp < 0) enemy.mechanic.hp = 0;

        finalText += `Вы нанесли врагу ${enemy.name} урон: ${hero.mechanic.damage}. `;
        finalText += `У врага осталось здоровья: ${enemy.mechanic.hp}\n`;
      }
    });

    targetEnemies.forEach((enemy) => {
      if (enemy.mechanic && hero.mechanic && enemy.mechanic.hp > 0) {
        hero.mechanic.hp -= enemy.mechanic.damage;
        if (hero.mechanic.hp < 0) hero.mechanic.hp = 0;

        finalText += `Враг ${enemy.name} нанес вам урон: ${enemy.mechanic.damage}. `;
        finalText += `У вас осталось здоровья: ${hero.mechanic.hp}\n`;
      }
    });

    if (hero.mechanic.hp <= 0) {
      finalText += 'Вы погибли! Игра окончена.\n';
    }

    if (enemies.every((enemy) => enemy.mechanic.hp <= 0)) {
      finalText +=
        'Все враги в локации побеждены! Поздравляем!\n Желаете изменить локацию?';
    }

    await this.gameRepository.save(currentGame);
    return finalText;
  }

  public async findGame(uuid: string) {
    return await this.gameRepository.findOne({
      where: { user: { user_id: uuid } },
      relations: [
        'user',
        'locations',
        'locations.npcs',
        'locations.npcs.mechanic',
      ],
    });
  }

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

  //Логика за изменение локации
  async changeLocation(uuid: string, newLocationId?: number) {
    const currentGame = await this.findGame(uuid);

    if (
      !currentGame ||
      !currentGame.locations ||
      currentGame.locations.length === 0
    ) {
      throw new NotFoundException('Игра или локации не найдены');
    }

    // Находим героя
    const hero = currentGame.locations
      .flatMap((location) => location.npcs)
      .find((npc) => npc.type === 'hero' && npc.current);

    if (!hero) {
      throw new NotFoundException('Герой не найден');
    }

    // Если `newLocationId` не передан, возвращаем список доступных локаций
    if (!newLocationId) {
      const availableLocations = currentGame.locations.map((loc) => ({
        id: loc.id,
        name: loc.name,
        description: loc.meta,
      }));

      return {
        message: 'Выберите одну из доступных локаций:',
        locations: availableLocations,
      };
    }

    // Проверяем, существует ли выбранная локация
    const newLocation = currentGame.locations.find(
      (loc) => loc.id === newLocationId,
    );

    if (!newLocation) {
      throw new NotFoundException('Выбранная локация не найдена');
    }

    // Убираем героя из старой локации
    currentGame.locations.forEach((location) => {
      location.npcs.forEach((npc) => {
        if (npc.id === hero.id) {
          npc.current = false;
        }
      });
    });

    // Добавляем героя в новую локацию
    newLocation.npcs.push(hero);
    hero.current = true;

    // Сохраняем обновленное состояние игры
    await this.gameRepository.save(currentGame);

    return `Вы переместились в локацию: ${newLocation.name}`;
  }
}
