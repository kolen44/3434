import { GameEntity } from 'src/game/entities/game.entity';
import { NpcEntity } from 'src/npcs/entities/npc.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LocationEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  image_url: string;

  @Column()
  name: string;

  @Column()
  meta: string;

  @Column()
  faction_id: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  altitude: string;

  @Column({ nullable: true })
  triggered_by: string;

  @OneToMany(() => NpcEntity, (npc) => npc.location, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  npcs: NpcEntity[] | null;

  @ManyToOne(() => GameEntity, (game) => game.locations, {
    nullable: true,
  })
  game: GameEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
