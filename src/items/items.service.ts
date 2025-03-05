import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemEntity } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const newItemObject = {
      image_url: createItemDto.image_url,
      meta: createItemDto.meta,
      name: createItemDto.name,
      faction_id: createItemDto.faction_id,
    };

    const newItem = await this.itemRepository.save(newItemObject);

    return newItem;
  }

  async findById(id: number) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['npc'],
    });
    if (!item) throw new NotFoundException('Данного предмета не найдено');
    return item;
  }

  async update(id: number, updateItemDto) {
    const item = await this.findById(id);
    if (!item)
      return new UnauthorizedException(
        'Проверьте данные предмета , так как сервер не может его найти',
      );
    return this.itemRepository.update(item.id, updateItemDto);
  }

  async delete(id: number) {
    const item = await this.findById(id);
    if (!item)
      return new UnauthorizedException(
        'Проверьте данные предмета , так как сервер не может его найти',
      );
    return this.itemRepository.delete(item.id);
  }
}
