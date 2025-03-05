import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FactionService } from './faction.service';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateFactionDto } from './dto/update-faction.dto';

@Controller('faction')
export class FactionController {
  constructor(private readonly factionService: FactionService) {}

  @Post()
  create(@Body() createFactionDto: CreateFactionDto) {
    return this.factionService.create(createFactionDto);
  }

  @Get()
  findAll() {
    return this.factionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFactionDto: UpdateFactionDto) {
    return this.factionService.update(+id, updateFactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factionService.remove(+id);
  }
}
