import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class InteractionEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  object_id: string;

  @Column()
  target_id: string;

  @Column()
  summary: string;

  @Column()
  interaction_count: number;

  @Column()
  triggered_by: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
