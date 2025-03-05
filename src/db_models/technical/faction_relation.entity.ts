import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FactionRelationEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  player_id: string;

  @Column()
  faction_id: string;

  @Column()
  summary: string;

  @Column()
  interaction_count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
