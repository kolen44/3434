import { UserEntity } from 'src/db_models/technical/user.entity';
import { LocationEntity } from 'src/locations/entities/location.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.games, {
    nullable: true,
  })
  user: UserEntity | null;

  @OneToMany(() => LocationEntity, (location) => location.game, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  locations: LocationEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
