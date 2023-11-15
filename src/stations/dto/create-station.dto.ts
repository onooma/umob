import { Provider } from '../../providers/entities/provider.entity';

export class CreateStationDto {
  name: string;
  externalId: string;
  numberOfAvailableBikes: number;
  provider: Provider;
}
