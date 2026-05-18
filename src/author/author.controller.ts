import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('authors')
@UseGuards(JwtAuthGuard)
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}
  @Get(':id/books')
  getBooksByAuthorId(@Param('id') authorId: string) {
    return this.authorService.getBooksByAuthorId(authorId);
  }
}
