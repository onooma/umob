import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { StationsModule } from '../stations/stations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), StationsModule],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
