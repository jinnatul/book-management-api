import { BookBaseSelectType } from '../db-args';
import { Author } from '../../authors/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Book {
  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  id: string;

  @ApiProperty({ example: 'The Great Gatsby' })
  title: string;

  @ApiProperty({ example: '978-3-16-148410-0' })
  isbn: string;

  @ApiPropertyOptional({ example: '2020-05-01', type: String, format: 'date' })
  publishedDate: string | null;

  @ApiPropertyOptional({ example: 'Fiction', type: String })
  genre: string | null;

  @ApiPropertyOptional({ type: () => Author })
  author?: Author;

  constructor(book: BookBaseSelectType) {
    Object.assign(this, book);

    this.publishedDate = book.publishedDate
      ? book.publishedDate.toISOString().split('T')[0]
      : null;

    if (book.author) {
      this.author = new Author(book.author);
    }
  }
}
