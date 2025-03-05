import { Controller, Get, Param } from '@nestjs/common';
import { ModelCreatorService } from './model_creator.service';

@Controller('model-creator')
export class ModelCreatorController {
  constructor(private readonly modelCreatorService: ModelCreatorService) {}

  @Get('/tg-game/:uuid')
  async createPlaceFromTG(@Param('uuid') uuid: string) {
    return await this.modelCreatorService.createPlaceFromTG(uuid);
  }

  // @Get('/tg-look/:uuid')
  // async handleLookModels(@Param('uuid') uuid: string) {
  //   return await this.modelCreatorService.createOrFindGame(uuid);
  // }

  @Get(':count')
  async createLocationNpcs(@Param('count') count: string) {
    return await this.modelCreatorService.createNewGamePlace(+count);
  }
}
