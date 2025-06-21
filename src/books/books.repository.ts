import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../config/prisma/prisma.service';
import { Book } from './entities';
import { BookBaseDBArgs } from './db-args';
import { CreateBookDto } from './dto';

@Injectable()
export class BooksRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new book.
   */
  async create(data: CreateBookDto): Promise<Book> {
    const { authorId, ...rest } = data;

    const book = await this.prisma.book.create({
      data: {
        ...rest,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      ...BookBaseDBArgs,
    });
    return new Book(book);
  }

  /**
   * Get all books.
   */

  async findAll(
    args?: Omit<Prisma.BookFindManyArgs, 'select'>,
  ): Promise<Book[]> {
    const books = await this.prisma.book.findMany({
      ...BookBaseDBArgs,
      ...args,
    });
    return books.map((book) => new Book(book));
  }

  /**
   * Find book by ID.
   * Throws 404 if not found.
   */
  async findById(id: string): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      ...BookBaseDBArgs,
    });
    if (!book) throw new NotFoundException(`Book ${id} not found!`);
    return new Book(book);
  }

  /**
   * Update book by ID.
   */
  async update(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
    await this.findById(id);
    const book = await this.prisma.book.update({
      where: { id },
      data,
      ...BookBaseDBArgs,
    });
    return new Book(book);
  }

  /**
   * Delete book by ID.
   */
  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.book.delete({ where: { id } });
  }

  /**
   * ISBN exist or not.
   */
  async isbnExists(isbn: string): Promise<boolean> {
    return Boolean(
      await this.prisma.book.findUnique({
        where: { isbn },
      }),
    );
  }

  async isISBNUniqueForUpdate(id: string, isbn: string): Promise<boolean> {
    const existingBook = await this.prisma.book.findUnique({
      where: { isbn },
    });
    return !existingBook || existingBook.id === id;
  }
}
