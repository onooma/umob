import { Injectable } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private readonly repository: Repository<Station>,
  ) {}

  async upsert(dto: CreateStationDto) {
    return this.repository.upsert(dto, ['externalId', 'provider']);
  }

  async findAll() {
    return this.repository.find({
      relations: ['provider'],
      take: 5,
    });
  }
}
