import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Provider } from '../../providers/entities/provider.entity';

@Entity()
@Unique('unique_provider_and_id', ['externalId', 'provider'])
export class Station extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  externalId: string;

  @Column()
  numberOfAvailableBikes: number;

  @ManyToOne(() => Provider, (provider) => provider.stations)
  provider: Provider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
