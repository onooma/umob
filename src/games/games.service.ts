import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Game } from './entities/game.entity';
import { QuestionsService } from '../questions/questions.service';
import { GameStatusEnum } from './game-status.enum';

@Injectable()
export class GamesService {
  private readonly GAME_DURATION = 60;

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Game) private readonly repository: Repository<Game>,
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

    await this.questionsService.generate(game);
    const nextQuestion = await this.questionsService.findNext(game);

    return { game, nextQuestion, remainingTime: this.GAME_DURATION };
  }

  async answer(id: number, answerIndex: number) {
    const game = await this.repository.findOneBy({ id });
    const elapsedTime = Math.floor(
      (new Date().getTime() - game.createdAt.getTime()) / 1000,
    );

    const remainingTime = this.GAME_DURATION - elapsedTime;
    if (remainingTime < 0) {
      await this.handleTimedOutGame(game);
    }

    await this.questionsService.answer(game, answerIndex);
    const nextQuestion = await this.questionsService.findNext(game);

    if (!nextQuestion) {
      game.status = GameStatusEnum.finished;
    }

    const answeredQuestions = await this.questionsService.findAnswered(game);
    const scores = answeredQuestions.map((question) =>
      question.userChoiceIndex === question.answerIndex ? 50 : -20,
    );

    game.score = scores.reduce((a, b) => a + b, 0);
    await this.repository.save(game);

    return { game, nextQuestion, answeredQuestions, remainingTime };
  }

  async findUserGames(limit?: number) {
    const user = this.request.user;
    return await this.repository.find({
      where: { user },
      order: { score: 'DESC' },
      take: limit,
    });
  }

  async leaderboard() {
    const games = await this.repository.find({
      relations: ['user'],
      order: { score: 'DESC' },
      take: 5,
    });

    return games.map((game) => ({
      user: game.user.username,
      score: game.score,
    }));
  }

  private async handleTimedOutGame(game: Game) {
    game.status = GameStatusEnum.timedOut;
    await this.repository.save(game);
    throw new HttpException(
      { status: HttpStatus.FORBIDDEN, error: 'Game is timed out!' },
      HttpStatus.FORBIDDEN,
    );
  }
}
