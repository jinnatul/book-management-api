import { BookBaseSelectType } from '../db-args';
import { Author } from '../../authors/entities';

export class Book {
  id: string;
  title: string;
  isbn: string;
  publishedDate: string | null;
  genre: string | null;
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
