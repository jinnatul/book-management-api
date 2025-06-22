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

import { AuthorsService } from './authors.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from './entities';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly service: AuthorsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: 201, description: 'Author created', type: Author })
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.service.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all authors with optional search & pagination',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'List of authors', type: [Author] })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ): Promise<Author[]> {
    return this.service.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'Author found', type: Author })
  findById(@Param('id') id: string): Promise<Author> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'Author updated', type: Author })
  update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.service.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 204, description: 'Author deleted' })
  @ApiResponse({
    status: 400,
    description: 'Author has existing books and cannot be removed.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
