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

import { AuthorsService } from './authors.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from './entities';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly service: AuthorsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.service.create(createAuthorDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ): Promise<Author[]> {
    return this.service.findAll(page, limit, search);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Author> {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.service.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
