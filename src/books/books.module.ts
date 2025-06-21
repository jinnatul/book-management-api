import { Module } from '@nestjs/common';

import { AuthorsModule } from '../authors/authors.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';

@Module({
  imports: [AuthorsModule],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository],
})
export class BooksModule {}
