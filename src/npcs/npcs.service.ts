import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MechanicEntity } from 'src/db_models/technical/mechanic.entity';
import { Repository } from 'typeorm';
import { CreateNpcDto } from './dto/create-npc.dto';
import { UpdateNpcDto } from './dto/update-npc.dto';
import { NpcEntity } from './entities/npc.entity';

@Injectable()
export class NpcsService {
  constructor(
    @InjectRepository(NpcEntity)
    private readonly npcRepository: Repository<NpcEntity>,
  ) {}

  async create(
    createNpcDto: CreateNpcDto,
    mechanic: MechanicEntity = null,
    type: string = 'npc',
  ) {
    const newNpcObject = {
      url: createNpcDto.url,
      meta: createNpcDto.meta,
      faction_id: createNpcDto.faction_id,
      gold_amount: createNpcDto.gold_amount,
      name: createNpcDto.name,
      rank: createNpcDto.rank,
      type,
      quests: [],
      items: [],
      mechanic,
    };

    // const existNpc = await this.findOne(newNpcObject);

    // if (existNpc)
    //   throw new BadRequestException(
    //     'Данный npc с такими же входными данными уже существует!',
    //   );

    const newNpc = await this.npcRepository.save(newNpcObject);

    return newNpc;
  }

  async delete(id: number) {
    const npc = await this.findById(id);
    if (!npc)
      return new UnauthorizedException(
        'Проверьте данные npc , так как сервер не может его найти',
      );
    return this.npcRepository.delete(npc.id);
  }

  async update(id: number, updateNpcDto) {
    const npc = await this.findById(id);
    if (!npc)
      return new UnauthorizedException(
        'Проверьте данные npc , так как сервер не может его найти',
      );
    return this.npcRepository.update(npc.id, updateNpcDto);
  }

  async updateForRelations(updateNpcDto) {
    const npc = await this.findById(updateNpcDto.id);
    if (!npc)
      return new UnauthorizedException(
        'Проверьте данные npc , так как сервер не может его найти',
      );
    return this.npcRepository.save(updateNpcDto);
  }

  async findById(id: number) {
    const npc = await this.npcRepository.findOne({
      where: { id },
      relations: ['quests', 'items', 'location', 'mechanic'],
    });
    if (!npc) throw new NotFoundException('Данного npc не найдено');
    return npc;
  }

  async findOne(existNpcObject: UpdateNpcDto) {
    const existNpc = await this.npcRepository.findOne({
      where: existNpcObject,
    });
    // if (!existNpc)
    //   throw new UnauthorizedException(
    //     'Npc с такими же входными данными существует',
    //   );
    return existNpc;
  }
}
