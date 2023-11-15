import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Exclude } from 'class-transformer';
import { AppEntity } from '../../utils/AppEntity';

@Entity()
export class Question extends AppEntity {
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
}
