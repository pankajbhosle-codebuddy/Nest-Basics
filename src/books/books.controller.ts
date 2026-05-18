import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BooksService } from './books.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import type { JwtPayload } from '../common/types/jwt-payload.type';

import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  createBook(@Body() dto: CreateBookDto, @CurrentUser() author: JwtPayload) {
    return this.booksService.createBook(dto, author);
  }

  @Get(':id')
  getBookById(@Param('id') id: string) {
    return this.booksService.getBookById(id);
  }

  @Delete(':id')
  deleteBookById(@Param('id') id: string) {
    return this.booksService.deleteBookById(id);
  }
}
