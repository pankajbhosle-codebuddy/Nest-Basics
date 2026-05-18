import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponseDto } from '../common/types/api-response.type';
import { BookResponseDto } from '../books/dto/book-response.dto';
import { mapBook } from '../books/utils/book.mapper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthorService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getBooksByAuthorId(
    authorId: string,
  ): Promise<ApiResponseDto<BookResponseDto[]>> {
    const cacheKey = `books:author:${authorId}`;

    const cachedBooks =
      await this.cacheManager.get<BookResponseDto[]>(cacheKey);

    if (cachedBooks) {
      console.log('CACHE HIT');
      return new ApiResponseDto(
        'Books fetched successfully (cache)',
        cachedBooks,
      );
    }

    const author = await this.prisma.author.findUnique({
      where: {
        id: authorId,
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

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const mappedBooks = author.books.map(mapBook);

    const responseData: BookResponseDto[] = mappedBooks;

    await this.cacheManager.set(cacheKey, responseData, 1000 * 60 * 5);

    return new ApiResponseDto('Books fetched successfully', responseData);
  }
}
