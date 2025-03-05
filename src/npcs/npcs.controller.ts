import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateNpcDto } from './dto/create-npc.dto';
import { UpdateNpcDto } from './dto/update-npc.dto';
import { NpcsService } from './npcs.service';

@Controller('npcs')
export class NpcsController {
  constructor(private readonly npcsService: NpcsService) {}

  @Post()
  async create(@Body() createNpcDto: CreateNpcDto) {
    return await this.npcsService.create(createNpcDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.npcsService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNpcDto: UpdateNpcDto) {
    return this.npcsService.update(+id, updateNpcDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.npcsService.delete(+id);
  }
}
