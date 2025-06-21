import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { getPagination } from '../common/utils/pagination.util';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookDto) {
    const author = await this.prisma.author.findUnique({
      where: { id: data.authorId },
    });
    if (!author) throw new BadRequestException('Author does not exist');
    return this.prisma.book.create({ data });
  }

  async findAll(query: any) {
    const { skip, limit } = getPagination(query);
    const where = {
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { isbn: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
      ...(query.authorId && { authorId: query.authorId }),
    };
    return this.prisma.book.findMany({
      where,
      skip,
      take: limit,
      include: { author: true },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, data: UpdateBookDto) {
    try {
      return await this.prisma.book.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Book not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.book.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Book not found');
    }
  }
}
