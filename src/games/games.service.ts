import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { QuestionsService } from '../questions/questions.service';
import { GameStatusEnum } from './game-status.enum';

@Injectable()
export class GamesService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
    private readonly questionsService: QuestionsService,
  ) {}

  async create() {
    const user = this.request.user;

    const game = await this.repository.save(
      this.repository.create({
        status: GameStatusEnum.running,
        user,
      }),
    );

    await this.questionsService.generate(game, 10);

    const nextQuestion = await this.questionsService.findNext(game);

    return { game, nextQuestion };
  }

  async answer(id: number, answerIndex: number) {
    const game = await this.repository.findOneBy({ id });

    await this.questionsService.answer(game, answerIndex);
    const nextQuestion = await this.questionsService.findNext(game);
    if (!nextQuestion) {
      game.status = GameStatusEnum.finished;
    }

    const answeredQuestions = await this.questionsService.findAnswered(game);

    const scores = answeredQuestions.map((question) => {
      if (question.userChoiceIndex === question.answerIndex) {
        return 50;
      }
      return -20;
    });
    game.score = scores.reduce((a, b) => a + b, 0);
    await this.repository.save(game);

    return { game, nextQuestion, answeredQuestions };
  }
}
