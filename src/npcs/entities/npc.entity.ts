//Character в документации

import { MechanicEntity } from 'src/db_models/technical/mechanic.entity';
import { UserEntity } from 'src/db_models/technical/user.entity';
import { ItemEntity } from 'src/items/entities/item.entity';
import { LocationEntity } from 'src/locations/entities/location.entity';
import { QuestEntity } from 'src/quests/entities/quest.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class NpcEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  type: string;

  @Column({
    nullable: true,
  })
  rank: string;

  @Column({
    nullable: true,
  })
  url: string;

  @Column({
    nullable: true,
  })
  meta: string;

  @Column({
    nullable: true,
  })
  current: boolean;

  @Column({
    nullable: true,
  })
  gold_amount: number;

  @Column({
    nullable: true,
  })
  faction_id: string;

  @Column({
    nullable: true,
  })
  triggered_by: string;

  @ManyToOne(() => LocationEntity, (location) => location.npcs, {
    nullable: true,
  })
  location: LocationEntity | null;

  @ManyToOne(() => UserEntity, (user) => user.npcs, {
    nullable: true,
  })
  user: UserEntity | null;

  @OneToOne(() => MechanicEntity, (mechanic) => mechanic.npc, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  mechanic: MechanicEntity | null;

  @OneToMany(() => QuestEntity, (quest) => quest.npc, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quests: QuestEntity[] | null;

  @OneToMany(() => ItemEntity, (item) => item.npc, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  items: ItemEntity[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
