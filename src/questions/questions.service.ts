import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { StationsService } from '../stations/stations.service';
import { Game } from '../games/entities/game.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly repository: Repository<Question>,
    private readonly stationsService: StationsService,
  ) {}

  async generate(game: Game, questionCount: number) {
    const stations = await this.stationsService.findAll(questionCount);

    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      const title = `How many "${station.provider.name}" bikes are available at "${station.name}"?`;
      const numberOfAvailableBikes = [station.numberOfAvailableBikes];
      const max = station.numberOfAvailableBikes * 3 + 7;
      while (numberOfAvailableBikes.length < 4) {
        const random = Math.floor(Math.random() * max);
        if (numberOfAvailableBikes.indexOf(random) === -1) {
          numberOfAvailableBikes.push(random);
        }
      }
      const correctAnswerIndex = numberOfAvailableBikes.indexOf(
        station.numberOfAvailableBikes,
      );
      const answers = numberOfAvailableBikes
        .sort(() => Math.random())
        .map((numberOfAvailableBike) => `${numberOfAvailableBike}`);

      const question = this.repository.create({
        title,
        choices: answers,
        answerIndex: correctAnswerIndex,
        game,
        questionOrder: i,
      });
      await this.repository.save(question);
    }
  }

  async findNext(game: Game) {
    return await this.repository.findOne({
      select: ['id', 'title', 'choices', 'questionOrder'],
      where: { game: { id: game.id }, userChoiceIndex: IsNull() },
      order: { questionOrder: 'ASC' },
    });
  }

  async findAnswered(game: Game) {
    return await this.repository.find({
      select: [
        'id',
        'title',
        'choices',
        'questionOrder',
        'answerIndex',
        'userChoiceIndex',
      ],
      where: { game: { id: game.id }, userChoiceIndex: Not(IsNull()) },
      order: { questionOrder: 'ASC' },
    });
  }

  async answer(game: Game, answerIndex: number) {
    const question = await this.findNext(game);
    question.userChoiceIndex = answerIndex;
    await this.repository.save(question);
  }
}
