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

  private async attemptRequest<T>(
    fn: () => Promise<T>,
    retries = 3,
  ): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        console.error(`Попытка ${attempt} не удалась:`, error);
        if (attempt >= retries) {
          throw new BadGatewayException(
            `Ошибка после ${retries} попыток: ` + error,
          );
        }
      }
    }
  }

  public async createLocation() {
    return this.attemptRequest(async () => {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: createLoationPrompt + ' Левая сторона генерации',
          },
        ],
        model: 'gpt-4o',
      });
      return JSON.parse(chatCompletion.choices[0].message.content);
    });
  }

  public async createNpc(locationData = null, type: string = 'npc') {
    return this.attemptRequest(async () => {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              createNpcPrompt +
              `Тип персонажа: ${type}. Данные о локации: ${JSON.stringify(locationData)}`,
          },
        ],
        model: 'gpt-4o',
      });
      return JSON.parse(chatCompletion.choices[0].message.content);
    });
  }

  public async createQuest(npcData: string) {
    return this.attemptRequest(async () => {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              createQuestPrompt + ` Данные о NPC: ${JSON.stringify(npcData)}`,
          },
        ],
        model: 'gpt-4o',
      });
      return JSON.parse(chatCompletion.choices[0].message.content);
    });
  }

  public async createItem(npcData) {
    return this.attemptRequest(async () => {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              createItemPrompt + ` Данные о NPC: ${JSON.stringify(npcData)}`,
          },
        ],
        model: 'gpt-4o',
      });
      return JSON.parse(chatCompletion.choices[0].message.content);
    });
  }

  public async createMechanic(
    type: 'npc' | 'enemy' | 'hero',
    characterData?: Object,
  ) {
    return this.attemptRequest(async () => {
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
          throw new Error('Некорректный тип механики');
      }

      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              prompt + ` Данные о ${type}: ${JSON.stringify(characterData)}`,
          },
        ],
        model: 'gpt-4o',
      });
      return JSON.parse(chatCompletion.choices[0].message.content);
    });
  }
}
