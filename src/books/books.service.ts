import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBookDto } from './dto/create-book.dto';

import { ApiResponseDto } from '../common/types/api-response.type';

import {
  AuthorResponseDto,
  BookResponseDto,
  GenreResponseDto,
} from './dto/book-response.dto';

import { JwtPayload } from '../common/types/jwt-payload.type';

import { BookWithRelations } from './types/book-with-relations.type';

import { CACHE_MANAGER } from '@nestjs/cache-manager';

import type { Cache } from 'cache-manager';

import { Inject } from '@nestjs/common';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private mapBook(book: BookWithRelations): BookResponseDto {
    return new BookResponseDto(
      book.id,
      book.title,
      book.description,

      new AuthorResponseDto(
        book.author.id,
        book.author.username,
        book.author._count?.books,
      ),

      book.genres.map(
        (genre) =>
          new GenreResponseDto(genre.id, genre.name, genre._count?.books),
      ),
      book.createdAt,
      book.updatedAt,
    );
  }

  async createBook(
    dto: CreateBookDto,
    author: JwtPayload,
  ): Promise<ApiResponseDto<BookResponseDto>> {
    const book = await this.prisma.books.create({
      data: {
        title: dto.title,
        description: dto.description,

        author: {
          connect: {
            id: author.id,
          },
        },

        genres: {
          connect: dto.genreIds.map((id) => ({
            id,
          })),
        },
      },

      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,

        author: {
          select: {
            id: true,
            username: true,

            _count: {
              select: {
                books: true,
              },
            },
          },
        },

        genres: {
          select: {
            id: true,
            name: true,

            _count: {
              select: {
                books: true,
              },
            },
          },
        },
      },
    });

    return new ApiResponseDto('Book created successfully', this.mapBook(book));
  }

  async getBookById(id: string): Promise<ApiResponseDto<BookResponseDto>> {
    const book = await this.prisma.books.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,

        author: {
          select: {
            id: true,
            username: true,
            password: true,
            v: true,
            createdAt: true,
            updatedAt: true,

            _count: {
              select: {
                books: true,
              },
            },
          },
        },

        genres: {
          select: {
            id: true,
            name: true,
            v: true,
            createdAt: true,
            updatedAt: true,
            bookIds: true,

            _count: {
              select: {
                books: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return new ApiResponseDto('Book fetched successfully', this.mapBook(book));
  }

  async deleteBookById(id: string): Promise<ApiResponseDto<{ id: string }>> {
    const book = await this.prisma.books.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.prisma.books.delete({
      where: {
        id,
      },
    });

    return new ApiResponseDto('Book deleted successfully', { id });
  }
}
