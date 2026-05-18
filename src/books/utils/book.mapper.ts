import { BookResponseDto } from '../dto/book-response.dto';

interface PrismaBook {
  id: string;
  title: string;
  description: string;

  createdAt: Date;
  updatedAt: Date;

  author: {
    id: string;
    username: string;
    _count?: {
      books: number;
    };
  };

  genres: {
    id: string;
    name: string;
    _count?: {
      books: number;
    };
  }[];
}

export const mapBook = (book: PrismaBook): BookResponseDto => {
  return {
    id: book.id,
    title: book.title,
    description: book.description,

    createdAt: book.createdAt,
    updatedAt: book.updatedAt,

    author: {
      id: book.author.id,
      username: book.author.username,
      ...(book.author._count && {
        _count: {
          books: book.author._count.books,
        },
      }),
    },

    genres: book.genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
      ...(genre._count && {
        _count: {
          books: genre._count.books,
        },
      }),
    })),
  };
};
