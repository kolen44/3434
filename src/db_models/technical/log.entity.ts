import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  core_mechanics: string;

  @Column()
  user_id: string;

  @Column()
  player_object_id: string;

  @Column()
  user_entered_text: string;

  @Column()
  request_text: string;

  @Column()
  generated_answer_text: string;

  @Column()
  image_url: string;

  @Column()
  random: number;

  @Column()
  timestamp: Date;
}
