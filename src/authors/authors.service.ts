import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthorsRepository } from './authors.repository';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from './entities';

@Injectable()
export class AuthorsService {
  constructor(private repository: AuthorsRepository) {}

  create(data: CreateAuthorDto): Promise<Author> {
    return this.repository.create(data);
  }

  findAll(page?: string, limit?: string, search?: string): Promise<Author[]> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNum - 1) * limitNum;

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

    return this.repository.findAll({ skip, take: limitNum, where });
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
}
