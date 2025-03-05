import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/:uuid')
  async startThisGame(@Param('uuid') uuid: string) {
    return this.gameService.startGame(uuid);
  }

  @Get('/hit/:uuid')
  async hitFromHero(@Param('uuid') uuid: string) {
    return this.gameService.hitLogic(uuid);
  }

  @Get('/change/:uuid/:numberLocation?')
  async changeLocation(
    @Param('uuid') uuid: string,
    @Param('numberLocation') numberLocation?: string, // `?` делает параметр необязательным
  ) {
    console.log('here');
    return this.gameService.changeLocation(
      uuid,
      numberLocation ? +numberLocation : undefined,
    );
  }
}
