import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Station } from '../../stations/entities/station.entity';
import { AppEntity } from '../../utils/AppEntity';

@Entity()
export class Provider extends AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', array: true, default: [] })
  urls: string[];

  @OneToMany(() => Station, (station) => station.provider)
  stations: Station[];
}
