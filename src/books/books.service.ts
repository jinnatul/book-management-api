import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BooksRepository } from './books.repository';
import { AuthorsService } from '../authors/authors.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { Book } from './entities';
import { getPagination } from '../common/utils/pagination.util';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    private repository: BooksRepository,
    private authorsService: AuthorsService,
  ) {}

  async create(data: CreateBookDto): Promise<Book> {
    this.logger.log(`Creating book: ${JSON.stringify(data)}`);

    const { authorId, isbn } = data;
    if (await this.repository.isbnExists(isbn)) {
      this.logger.warn(`Duplicate ISBN detected: ${isbn}`);
      throw new ConflictException(
        'The provided ISBN is already in use. Please use a unique ISBN.',
      );
    }

    const authorExists = await this.authorsService.authorExists(authorId);
    if (!authorExists) {
      this.logger.error(`Invalid authorId: ${authorId}`);
      throw new BadRequestException(
        'The selected author does not exist. Please choose a valid author',
      );
    }

    const book = await this.repository.create(data);
    this.logger.log(`Book created with ID=${book.id}`);
    return book;
  }

  findAll(
    page?: string,
    limit?: string,
    search?: string,
    authorId?: string,
  ): Promise<Book[]> {
    this.logger.log(
      `Fetching books with page=${page}, limit=${limit}, search="${search}", authorId=${authorId}`,
    );

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
    this.logger.log(`Fetching book by ID=${id}`);
    return this.repository.findById(id);
  }

  async update(id: string, data: UpdateBookDto): Promise<Book> {
    this.logger.log(
      `Updating book ID=${id} with data: ${JSON.stringify(data)}`,
    );

    const { authorId, isbn } = data;

    if (isbn) {
      const isUnique = await this.repository.isISBNUniqueForUpdate(id, isbn);
      if (!isUnique) {
        this.logger.warn(`ISBN conflict on update for ID=${id}, ISBN=${isbn}`);
        throw new ConflictException(
          'The provided ISBN is already in use by another book. Please use a unique ISBN.',
        );
      }
    }

    if (authorId) {
      const authorExists = await this.authorsService.authorExists(authorId);
      if (!authorExists) {
        this.logger.error(`Invalid authorId on update: ${authorId}`);
        throw new BadRequestException(
          'The selected author does not exist. Please choose a valid author.',
        );
      }
    }

    const updatedBook = await this.repository.update(id, data);
    this.logger.log(`Book updated ID=${updatedBook.id}`);
    return updatedBook;
  }

  async remove(id: string): Promise<void> {
    this.logger.warn(`Deleting book with ID=${id}`);
    await this.repository.remove(id);
    this.logger.log(`Book deleted ID=${id}`);
  }

  hasBooksByAuthor(authorId: string): Promise<boolean> {
    this.logger.log(`Checking books for authorId=${authorId}`);
    return this.repository.hasBooksByAuthor(authorId);
  }
}
