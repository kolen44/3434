import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserResponseRecommendationEntity } from './user_response_recommendation.entity';

@Entity()
export class UserResponseGenEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  loreAnswer: string;

  @ManyToOne(
    () => UserResponseRecommendationEntity,
    (rec) => rec.response_gen,
    {
      nullable: true,
    },
  )
  response_recommendation: UserResponseRecommendationEntity | null;
}
