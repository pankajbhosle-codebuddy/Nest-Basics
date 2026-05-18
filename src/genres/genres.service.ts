import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateGenreDto } from './dto/create-genre.dto';

import { ApiResponseDto } from '../common/types/api-response.type';

import { GenreResponseDto } from './dto/genre-response.dto';
import { BookResponseDto } from '../books/dto/book-response.dto';
import { mapBook } from '../books/utils/book.mapper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class GenresService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createGenre(
    dto: CreateGenreDto,
  ): Promise<ApiResponseDto<GenreResponseDto>> {
    if (
      await this.prisma.genre.findUnique({
        where: {
          name: dto.name,
        },
      })
    ) {
      throw new BadRequestException('Genre already exists');
    }

    const genre = await this.prisma.genre.create({
      data: {
        name: dto.name,
      },
    });

    return new ApiResponseDto('Genre created successfully', genre);
  }

  async getBooksByGenreId(
    genreId: string,
  ): Promise<ApiResponseDto<BookResponseDto[]>> {
    const cacheKey = `books:genre:${genreId}`;

    const cachedBooks =
      await this.cacheManager.get<BookResponseDto[]>(cacheKey);

    if (cachedBooks) {
      console.log('CACHE HIT');
      return new ApiResponseDto(
        'Books fetched successfully (cache)',
        cachedBooks,
      );
    }

    const genre = await this.prisma.genre.findUnique({
      where: {
        id: genreId,
      },

      include: {
        books: {
          include: {
            author: true,
            genres: true,
          },
        },
      },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    const mappedBooks = genre.books.map(mapBook);

    const responseData: BookResponseDto[] = mappedBooks;

    await this.cacheManager.set(cacheKey, responseData, 1000 * 60 * 5);

    return new ApiResponseDto('Books fetched successfully', responseData);
  }
}
