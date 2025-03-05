import { Injectable } from '@nestjs/common';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateFactionDto } from './dto/update-faction.dto';

@Injectable()
export class FactionService {
  create(createFactionDto: CreateFactionDto) {
    return 'This action adds a new faction';
  }

  findAll() {
    return `This action returns all faction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} faction`;
  }

  update(id: number, updateFactionDto: UpdateFactionDto) {
    return `This action updates a #${id} faction`;
  }

  remove(id: number) {
    return `This action removes a #${id} faction`;
  }
}
