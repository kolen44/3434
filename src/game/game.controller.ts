import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  private static readonly exampleUuid = '550e8400-e29b-41d4-a716-446655440000';

  @Get('/change/:uuid/:numberLocation')
  @ApiOperation({ summary: 'Change player location' })
  @ApiParam({ name: 'uuid', example: GameController.exampleUuid })
  @ApiParam({ name: 'numberLocation', example: 2 })
  async changeLocation(
    @Param('uuid') uuid: string,
    @Param('numberLocation') numberLocation?: string,
  ) {
    return this.gameService.changeLocation(
      uuid,
      numberLocation ? +numberLocation : undefined,
    );
  }

  @Get('/create/:uuid/:characters/:locations')
  @ApiOperation({ summary: 'Start a new game' })
  @ApiParam({ name: 'uuid', example: GameController.exampleUuid })
  @ApiParam({ name: 'characters', example: 1 })
  @ApiParam({ name: 'locations', example: 3 })
  async startThisGame(
    @Param('uuid') uuid: string,
    @Param('characters') characters: string,
    @Param('locations') locations: string,
  ) {
    return this.gameService.startGame(uuid, +characters, +locations);
  }

  @Get('/hit/:uuid/:enemy')
  @ApiOperation({ summary: 'Hit an enemy' })
  @ApiParam({ name: 'uuid', example: GameController.exampleUuid })
  @ApiParam({ name: 'enemy', example: 5 })
  async hitFromHero(
    @Param('uuid') uuid: string,
    @Param('enemy') enemy: string,
  ) {
    return this.gameService.hitLogic(uuid, +enemy);
  }
}
