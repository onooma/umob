import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import axios from 'axios';
import { GBFSProviderResponse } from './interfaces/GBFSProviderResponse';
import { GBFSStationInformation } from './interfaces/GBFSStationInformation';
import { GBFSStationStatus } from './interfaces/GBFSStationStatus';
import { GBFSStationResponse } from './interfaces/GBFSStationResponse';
import { StationsService } from '../stations/stations.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProvidersService implements OnModuleInit {
  constructor(
    @InjectRepository(Provider)
    private readonly repository: Repository<Provider>,
    private readonly stationsService: StationsService,
  ) {}

  async onModuleInit() {
    await this.seed();
    await this.fetchAllGBFSProviders();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    await this.fetchAllGBFSProviders();
  }

  private async create(createProviderDto: CreateProviderDto) {
    const provider: Provider = new Provider();
    provider.name = createProviderDto.name;
    provider.urls = createProviderDto.urls;
    return this.repository.save(provider);
  }

  private async fetchAllGBFSProviders() {
    const providers = await this.repository.find();

    for (const provider of providers) {
      const stations = await this.fetchGBFSProviderStations(provider);

      for (const station of stations) {
        await this.stationsService.upsert({
          name: station.name,
          externalId: station.station_id,
          numberOfAvailableBikes: station.num_bikes_available,
          provider,
        });
      }
    }

    return providers;
  }

  private async fetchGBFSProviderStations(provider: Provider) {
    const stations: (GBFSStationInformation & GBFSStationStatus)[] = [];

    for (const url of provider.urls) {
      const response = await axios.get<GBFSProviderResponse>(url);
      const feeds = response.data.data.nl.feeds;

      const stationInformationFeed = feeds.find(
        (feed) => feed.name === 'station_information',
      );
      if (!stationInformationFeed) {
        continue;
      }

      const stationInformationResponse = await axios.get<
        GBFSStationResponse<GBFSStationInformation>
      >(stationInformationFeed.url);
      const stationInformationData =
        stationInformationResponse.data.data.stations;

      const stationStatusFeed = feeds.find(
        (feed) => feed.name === 'station_status',
      );
      if (!stationStatusFeed) {
        continue;
      }

      const stationStatusResponse = await axios.get<
        GBFSStationResponse<GBFSStationStatus>
      >(stationStatusFeed.url);
      const stationStatusData = stationStatusResponse.data.data.stations;

      for (const stationInformation of stationInformationData) {
        const stationStatus = stationStatusData.find(
          (stationStatus) =>
            stationStatus.station_id === stationInformation.station_id,
        );

        if (!stationStatus) {
          continue;
        }

        stations.push({
          ...stationInformation,
          ...stationStatus,
        });
      }
    }

    return stations;
  }

  private async seed() {
    const count = await this.repository.count();
    if (count > 0) {
      return;
    }

    await this.create({
      name: 'NS OV Fiets',
      urls: ['http://gbfs.openov.nl/ovfiets/gbfs.json'],
    });

    await this.create({
      name: 'GoAbout',
      urls: ['https://gbfs.goabout.com/2/gbfs.json'],
    });

    await this.create({
      name: 'Donkey Republic',
      urls: [
        'https://stables.donkey.bike/api/public/gbfs/2/donkey_am/gbfs.json',
        'https://stables.donkey.bike/api/public/gbfs/2/donkey_den_haag/gbfs.json',
        'https://stables.donkey.bike/api/public/gbfs/2/donkey_dordrecht/gbfs.json',
        'https://stables.donkey.bike/api/public/gbfs/2/donkey_gorinchem/gbfs.json',
        'https://stables.donkey.bike/api/public/gbfs/2/donkey_rt/gbfs.json',
        'https://stables.donkey.bike/api/public/gbfs/2/donkey_rotterdam_den_haag/gbfs',
        'https://stables.donkey.bike/api/public/gbfs/2/donkey_ut/gbfs.json',
        'https://stables.donkey.bike/api/public/gbfs/2/donkey_utrechtse_heuvelrug/gbfs.json',
      ],
    });
  }
}
