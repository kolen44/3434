import { NpcEntity } from 'src/npcs/entities/npc.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class QuestEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  description: string;

  @Column()
  meta: string;

  @Column({
    nullable: true,
  })
  triggered_by: string;

  @Column()
  ended: boolean = false;

  @ManyToOne(() => NpcEntity, (npc) => npc.quests, {
    nullable: true,
  })
  npc: NpcEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
