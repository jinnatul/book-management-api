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
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { Book } from './entities';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly service: BooksService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created', type: Book })
  @ApiResponse({
    status: 400,
    description:
      'The selected author does not exist. Please choose a valid author',
  })
  @ApiResponse({
    status: 409,
    description:
      'The provided ISBN is already in use. Please use a unique ISBN.',
  })
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.service.create(createBookDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all books with optional search, pagination & author filter',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiResponse({ status: 200, description: 'List of books', type: [Book] })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
  ): Promise<Book[]> {
    return this.service.findAll(page, limit, search, authorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book found', type: Book })
  findById(@Param('id') id: string): Promise<Book> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book updated', type: Book })
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.service.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 204, description: 'Book deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
