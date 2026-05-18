import { Prisma } from '@prisma/client';

export type BookWithRelations = Prisma.booksGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    createdAt: true;
    updatedAt: true;

    author: {
      select: {
        id: true;
        username: true;

        _count: {
          select: {
            books: true;
          };
        };
      };
    };

    genres: {
      select: {
        id: true;
        name: true;

        _count: {
          select: {
            books: true;
          };
        };
      };
    };
  };
}>;
