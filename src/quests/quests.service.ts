import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestDto } from './dto/create-quest.dto';
import { QuestEntity } from './entities/quest.entity';

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(QuestEntity)
    private readonly questRepository: Repository<QuestEntity>,
  ) {}

  async create(createQuestDto: CreateQuestDto) {
    const newQuestObject = {
      description: createQuestDto.description,
      meta: createQuestDto.meta,
      ended: false,
    };

    const newQuest = await this.questRepository.save(newQuestObject);

    return newQuest;
  }

  async findById(id: number) {
    const quest = await this.questRepository.findOne({
      where: { id },
      relations: ['npc'],
    });
    if (!quest) throw new NotFoundException('Данного квеста не найдено');
    return quest;
  }

  async update(id: number, updateQuestDto) {
    const quest = await this.findById(id);
    if (!quest)
      return new UnauthorizedException(
        'Проверьте данные квеста , так как сервер не может его найти',
      );
    return this.questRepository.update(quest.id, updateQuestDto);
  }

  async delete(id: number) {
    const quest = await this.findById(id);
    if (!quest)
      return new UnauthorizedException(
        'Проверьте данные квеста , так как сервер не может его найти',
      );
    return this.questRepository.delete(quest.id);
  }
}
