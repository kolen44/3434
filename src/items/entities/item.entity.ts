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
export class ItemEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  meta: string;

  @Column({
    nullable: true,
  })
  faction_id: string;

  @Column({ nullable: true })
  equipped: boolean;

  @Column({ nullable: true })
  triggered_by: string;

  @ManyToOne(() => NpcEntity, (npc) => npc.items, { nullable: true })
  npc: NpcEntity[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
