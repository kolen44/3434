import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AttributesEntity {
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

  @UpdateDateColumn()
  updatedAt: Date;
}
