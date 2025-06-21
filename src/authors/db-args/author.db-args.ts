import { Prisma } from '@prisma/client';

export const AuthorBaseDBArgs = Prisma.validator<Prisma.AuthorDefaultArgs>()({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    bio: true,
    birthDate: true,
  },
});

export type AuthorBaseSelectType = Prisma.AuthorGetPayload<
  typeof AuthorBaseDBArgs
>;
