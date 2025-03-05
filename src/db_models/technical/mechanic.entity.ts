import { NpcEntity } from 'src/npcs/entities/npc.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MechanicEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({
    nullable: true,
  })
  hp: number;

  @Column({
    nullable: true,
  })
  damage: number;

  @Column({
    nullable: true,
  })
  mana: number;

  @Column({
    nullable: true,
  })
  exp: number;

  @Column({
    nullable: true,
  })
  dexterity: number;

  @Column({
    nullable: true,
  })
  ability: string;

  @OneToOne(() => NpcEntity, (npc) => npc.mechanic, {
    nullable: true,
  })
  @JoinColumn()
  npc: NpcEntity | null;
}
