import { AuthorBaseSelectType } from '../db-args';

export class Author {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  birthDate: string | null;

  constructor(author: AuthorBaseSelectType) {
    Object.assign(this, author);
    this.birthDate = author.birthDate
      ? author.birthDate.toISOString().split('T')[0]
      : null;
  }
}
