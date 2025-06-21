import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AuthorsRepository } from './authors.repository';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from './entities';
import { getPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class AuthorsService {
  constructor(private repository: AuthorsRepository) {}

  create(data: CreateAuthorDto): Promise<Author> {
    return this.repository.create(data);
  }

  findAll(page?: string, limit?: string, search?: string): Promise<Author[]> {
    const where = search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : undefined;

    const { skip, take } = getPagination(page, limit);
    return this.repository.findAll({ skip, take, where });
  }

  findById(id: string): Promise<Author> {
    return this.repository.findById(id);
  }

  update(id: string, data: UpdateAuthorDto): Promise<Author> {
    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.repository.remove(id);
  }

  authorExists(id: string): Promise<boolean> {
    return this.repository.authorExists(id);
  }
}
