import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { StationsModule } from '../stations/stations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Provider]), StationsModule],
  providers: [ProvidersService],
})
export class ProvidersModule {}
