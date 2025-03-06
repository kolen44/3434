import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Get('/change/:uuid/:numberLocation?')
  async changeLocation(
    @Param('uuid') uuid: string,
    @Param('numberLocation') numberLocation?: string,
  ) {
    console.log('here');
    return this.gameService.changeLocation(
      uuid,
      numberLocation ? +numberLocation : undefined,
    );
  }

  @Get('/create/:uuid/:characters/:locations')
  async startThisGame(
    @Param('uuid') uuid: string,
    @Param('characters') characters: number = 1,
    @Param('locations') locations: number = 1,
  ) {
    return this.gameService.startGame(uuid, +characters, +locations);
  }

  @Get('/hit/:uuid/:enemy')
  async hitFromHero(
    @Param('uuid') uuid: string,
    @Param('enemy') enemy: number,
  ) {
    return this.gameService.hitLogic(uuid, enemy);
  }
}
