import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FactionEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  description: string;

  @Column()
  meta: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
