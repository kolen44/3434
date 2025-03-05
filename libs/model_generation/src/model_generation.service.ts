import { BadGatewayException, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createItemPrompt } from '../prompts/createItem';
import { createLoationPrompt } from '../prompts/createLocation';
import {
  createMechanicEnemyPrompt,
  createMechanicHeroPrompt,
  createMechanicNpcPrompt,
} from '../prompts/createMechanic';
import { createNpcPrompt } from '../prompts/createNpc';
import { createQuestPrompt } from '../prompts/createQuest';

@Injectable()
export class ModelGenerationService {
  private client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  constructor() {}

  public async createLocation() {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: createLoationPrompt + 'Левая сторона генерации',
          },
        ],
        model: 'gpt-4o',
      });

      return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
      throw new BadGatewayException('Ошибка в функции createLocation ' + error);
    }
  }

  public async createNpc(locationData = null, type: string = 'npc') {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              createNpcPrompt +
              `Тип персонажа (они могут быть npc и врагами, на основании этого тебе нужно придумывать соответствующее описание и название персонажу) - ${type}. Данные о локации в которой находится персонаж: ${JSON.stringify(locationData)}`,
          },
        ],
        model: 'gpt-4o',
      });

      return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
      throw new BadGatewayException('Ошибка в функции createNpc ' + error);
    }
  }

  public async createQuest(npcData: string) {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              createQuestPrompt +
              `Данные о npc персонаже к которому прикреплен квест: ${JSON.stringify(npcData)}`,
          },
        ],
        model: 'gpt-4o',
      });

      return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
      throw new BadGatewayException('Ошибка в функции createQuest ' + error);
    }
  }

  public async createItem(npcData) {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              createItemPrompt +
              `Данные о npc персонаже к которому прикреплен данный item: ${JSON.stringify(npcData)}`,
          },
        ],
        model: 'gpt-4o',
      });

      return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
      throw new BadGatewayException('Ошибка в функции createItem ' + error);
    }
  }

  public async createMechanic(
    type: 'npc' | 'enemy' | 'hero',
    characterData?: Object,
  ) {
    try {
      let prompt: string;

      switch (type) {
        case 'npc':
          prompt = createMechanicNpcPrompt;
          break;
        case 'enemy':
          prompt = createMechanicEnemyPrompt;
          break;
        case 'hero':
          prompt = createMechanicHeroPrompt;
          break;
        default:
          throw new Error('Invalid mechanic type');
      }

      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              prompt +
              ` Данные о ${type} персонаже для которого ты генерируешь механики , опирайся на эти данные что бы сгенерировать подходящие механики: ${JSON.stringify(characterData)}`,
          },
        ],
        model: 'gpt-4o',
      });

      return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
      throw new BadGatewayException('Ошибка в функции createMechanic ' + error);
    }
  }
}
