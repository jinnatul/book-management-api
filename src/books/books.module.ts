import { forwardRef, Module } from '@nestjs/common';

import { AuthorsModule } from '../authors/authors.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';

@Module({
  imports: [forwardRef(() => AuthorsModule)],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository],
  exports: [BooksService],
})
export class BooksModule {}
