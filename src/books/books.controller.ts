import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';

import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { Book } from './entities';

@Controller('books')
export class BooksController {
  constructor(private readonly service: BooksService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.service.create(createBookDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
  ): Promise<Book[]> {
    return this.service.findAll(page, limit, search, authorId);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Book> {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.service.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
