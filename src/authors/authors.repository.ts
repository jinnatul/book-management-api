import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../config/prisma/prisma.service';
import { Author } from './entities';
import { AuthorBaseDBArgs } from './db-args';

@Injectable()
export class AuthorsRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new author.
   */
  async create(data: Prisma.AuthorCreateInput): Promise<Author> {
    const author = await this.prisma.author.create({
      data,
      ...AuthorBaseDBArgs,
    });
    return new Author(author);
  }

  /**
   * Get all authors.
   */
  async findAll(): Promise<Author[]> {
    const authors = await this.prisma.author.findMany(AuthorBaseDBArgs);
    return authors.map((author) => new Author(author));
  }

  /**
   * Find author by ID.
   * Throws 404 if not found.
   */
  async findById(id: string): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
      ...AuthorBaseDBArgs,
    });
    if (!author) throw new NotFoundException(`Author ${id} not found!`);
    return new Author(author);
  }

  /**
   * Update author by ID.
   */
  async update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author> {
    await this.findById(id);
    const author = await this.prisma.author.update({
      where: { id },
      data,
      ...AuthorBaseDBArgs,
    });
    return new Author(author);
  }

  /**
   * Delete author by ID.
   */
  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.author.delete({ where: { id } });
  }
}
