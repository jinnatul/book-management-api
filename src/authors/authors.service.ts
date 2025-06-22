import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AuthorsRepository } from './authors.repository';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from './entities';
import { getPagination } from '../common/utils/pagination.util';
import { BooksService } from '../books/books.service';

@Injectable()
export class AuthorsService {
  private readonly logger = new Logger(AuthorsService.name);

  constructor(
    private repository: AuthorsRepository,
    @Inject(forwardRef(() => BooksService))
    private booksService: BooksService,
  ) {}

  async create(data: CreateAuthorDto): Promise<Author> {
    this.logger.log(`Creating author: ${JSON.stringify(data)}`);
    const author = await this.repository.create(data);
    this.logger.log(`Author created with ID: ${author.id}`);
    return author;
  }

  findAll(page?: string, limit?: string, search?: string): Promise<Author[]> {
    this.logger.log(
      `Fetching authors with page=${page}, limit=${limit}, search="${search}"`,
    );

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
    this.logger.log(`Fetching author by ID: ${id}`);
    return this.repository.findById(id);
  }

  async update(id: string, data: UpdateAuthorDto): Promise<Author> {
    this.logger.log(
      `Updating author ID=${id} with data: ${JSON.stringify(data)}`,
    );
    const author = await this.repository.update(id, data);
    this.logger.log(`Updated author ID=${author.id}`);
    return author;
  }

  async remove(id: string): Promise<void> {
    this.logger.warn(`Attempting to delete author ID=${id}`);
    const hasBooks = await this.booksService.hasBooksByAuthor(id);
    if (hasBooks) {
      this.logger.error(`Cannot delete author ID=${id}: has existing books`);
      throw new BadRequestException(
        'Author has existing books and cannot be removed.',
      );
    }

    await this.repository.remove(id);
    this.logger.log(`Author deleted ID=${id}`);
  }

  authorExists(id: string): Promise<boolean> {
    this.logger.log(`Checking existence of author ID=${id}`);
    return this.repository.authorExists(id);
  }
}
