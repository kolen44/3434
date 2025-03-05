import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserResponseGenEntity } from './user_response_gen.entity';

@Entity()
export class UserResponseRecommendationEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  model: string;

  @Column()
  isNew: boolean = false;

  @Column()
  description: string;

  @OneToMany(
    () => UserResponseGenEntity,
    (rec) => rec.response_recommendation,
    {
      nullable: true,
    },
  )
  response_gen: UserResponseGenEntity | null;
}
