import { NpcEntity } from 'src/npcs/entities/npc.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameEntity } from '../../game/entities/game.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  object_id: string;

  @Column()
  is_premium: boolean;

  @OneToMany(() => GameEntity, (game) => game.user, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  games: GameEntity[] | null;

  @OneToMany(() => NpcEntity, (npc) => npc.user, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  npcs: NpcEntity[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
