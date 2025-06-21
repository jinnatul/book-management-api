import { Prisma } from '@prisma/client';

export const BookBaseDBArgs = Prisma.validator<Prisma.BookDefaultArgs>()({
  select: {
    id: true,
    title: true,
    isbn: true,
    publishedDate: true,
    genre: true,
    author: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        birthDate: true,
      },
    },
  },
});

export type BookBaseSelectType = Prisma.BookGetPayload<typeof BookBaseDBArgs>;
