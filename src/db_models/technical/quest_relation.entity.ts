import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class QuestRelationEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  quest_id: string;

  @Column()
  object_id: string;

  @Column()
  meta: string;

  @Column()
  triggered_by: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
