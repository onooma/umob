import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'varchar', array: true })
  choices: string[];

  @Column()
  @Exclude({ toPlainOnly: true })
  answerIndex: number;

  @Column({ nullable: true })
  userChoiceIndex: number;

  @Column()
  questionOrder: number;

  @ManyToOne(() => Game, (game) => game.questions)
  game: Game;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
