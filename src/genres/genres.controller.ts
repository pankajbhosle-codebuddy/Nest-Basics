import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { GenresService } from './genres.service';

import { CreateGenreDto } from './dto/create-genre.dto';

import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';

import { createGenreSchema } from './schemas/create-genre.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('genres')
@UseGuards(JwtAuthGuard)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  createGenre(
    @Body(new JoiValidationPipe(createGenreSchema))
    dto: CreateGenreDto,
  ) {
    return this.genresService.createGenre(dto);
  }

  @Get(':id/books')
  getBooksByGenreId(@Param('id') id: string) {
    return this.genresService.getBooksByGenreId(id);
  }
}
