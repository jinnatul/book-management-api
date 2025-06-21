import { Module } from '@nestjs/common';

import { BooksModule } from '../books/books.module';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { AuthorsRepository } from './authors.repository';

@Module({
  imports: [BooksModule],
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsRepository],
  exports: [AuthorsService],
})
export class AuthorsModule {}
