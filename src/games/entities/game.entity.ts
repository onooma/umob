import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { GameStatusEnum } from '../game-status.enum';
import { AppEntity } from '../../utils/AppEntity';

@Entity()
export class Game extends AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.games)
  user: User;

  @OneToMany(() => Question, (question) => question.game)
  questions: Question[];

  @Column({ default: 0 })
  score: number;

  @Column({ default: 10 })
  questionCount: number;

  @Column({ default: GameStatusEnum.created })
  status: string;
}
