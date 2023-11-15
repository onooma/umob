import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Game } from '../../games/entities/game.entity';
import { AppEntity } from '../../utils/AppEntity';

@Entity()
export class User extends AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Game, (game) => game.user)
  games: Game[];
}
