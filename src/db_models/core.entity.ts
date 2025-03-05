//базовые правила и механики мира

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CoreEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  core_mechanics: string;

  @Column()
  global_quest_id: string;

  @Column()
  global_rules: string;

  @Column()
  triggered_by: string;

  @CreateDateColumn()
  createdAt: Date;
}
