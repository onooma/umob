import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Provider } from '../../providers/entities/provider.entity';
import { AppEntity } from '../../utils/AppEntity';

@Entity()
@Unique('unique_provider_and_id', ['externalId', 'provider'])
export class Station extends AppEntity {
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
}
