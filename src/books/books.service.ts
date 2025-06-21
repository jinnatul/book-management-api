import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BooksRepository } from './books.repository';
import { AuthorsService } from '../authors/authors.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { Book } from './entities';
import { getPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class BooksService {
  constructor(
    private repository: BooksRepository,
    private authorsService: AuthorsService,
  ) {}

  async create(data: CreateBookDto): Promise<Book> {
    const { authorId, isbn } = data;
    if (await this.repository.isbnExists(isbn)) {
      throw new ConflictException(
        'The provided ISBN is already in use. Please use a unique ISBN.',
      );
    }

    const authorExists = await this.authorsService.authorExists(authorId);
    if (!authorExists) {
      throw new BadRequestException(
        'The selected author does not exist. Please choose a valid author',
      );
    }

    return await this.repository.create(data);
  }

  findAll(
    page?: string,
    limit?: string,
    search?: string,
    authorId?: string,
  ): Promise<Book[]> {
    const searchCondition = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              isbn: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : undefined;

    const authorCondition = authorId
      ? {
          authorId: authorId,
        }
      : undefined;

    const where =
      searchCondition && authorCondition
        ? {
            AND: [searchCondition, authorCondition],
          }
        : searchCondition || authorCondition || undefined;

    const { skip, take } = getPagination(page, limit);
    return this.repository.findAll({ skip, take, where });
  }

  findById(id: string): Promise<Book> {
    return this.repository.findById(id);
  }

  async update(id: string, data: UpdateBookDto): Promise<Book> {
    const { authorId, isbn } = data;

    if (isbn) {
      const isUnique = await this.repository.isISBNUniqueForUpdate(id, isbn);
      if (!isUnique) {
        throw new ConflictException(
          'The provided ISBN is already in use by another book. Please use a unique ISBN.',
        );
      }
    }

    if (authorId) {
      const authorExists = await this.authorsService.authorExists(authorId);
      if (!authorExists) {
        throw new BadRequestException(
          'The selected author does not exist. Please choose a valid author.',
        );
      }
    }

    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.repository.remove(id);
  }
}
