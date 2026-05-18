export class GenreResponseDto {
  id: string;
  name: string;
  _count?: {
    books: number;
  };

  constructor(id: string, name: string, booksCount?: number) {
    this.id = id;
    this.name = name;
    if (booksCount !== undefined) {
      this._count = {
        books: booksCount,
      };
    }
  }
}

export class AuthorResponseDto {
  id: string;
  username: string;
  _count?: {
    books: number;
  };

  constructor(id: string, username: string, booksCount?: number) {
    this.id = id;
    this.username = username;
    if (booksCount !== undefined) {
      this._count = {
        books: booksCount,
      };
    }
  }
}

export class BookResponseDto {
  id: string;
  title: string;
  description: string;
  author: AuthorResponseDto;
  genres: GenreResponseDto[];
  createdAt!: Date;

  updatedAt!: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    author: AuthorResponseDto,
    genres: GenreResponseDto[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.author = author;
    this.genres = genres;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
