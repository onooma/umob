import { Module } from '@nestjs/common';
import { StationsService } from './stations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from './entities/station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Station])],
  providers: [StationsService],
  exports: [StationsService],
})
export class StationsModule {}
