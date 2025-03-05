import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NpcEntity } from './entities/npc.entity';
import { NpcsController } from './npcs.controller';
import { NpcsService } from './npcs.service';

@Module({
  imports: [TypeOrmModule.forFeature([NpcEntity])],
  controllers: [NpcsController],
  providers: [NpcsService],
})
export class NpcsModule {}
