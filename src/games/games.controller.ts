import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnswerGameQuestionDto } from './dto/answer-game-question.dto';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly service: GamesService) {}

  @Post()
  async create() {
    return this.service.create();
  }

  @Post(':id/answer')
  answer(
    @Param('id') id: number,
    @Body() answerGameQuestionDto: AnswerGameQuestionDto,
  ) {
    return this.service.answer(+id, answerGameQuestionDto.choiceIndex);
  }
}
