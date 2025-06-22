import { ApiProperty } from '@nestjs/swagger';
import { AuthorBaseSelectType } from '../db-args';

export class Author {
  @ApiProperty({ example: 'uuid-1234' })
  id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({
    example: 'Award-winning science fiction author.',
    type: String,
    nullable: true,
    required: false,
  })
  bio: string | null;

  @ApiProperty({
    example: '1980-01-15',
    type: String,
    nullable: true,
    required: false,
  })
  birthDate: string | null;

  constructor(author: AuthorBaseSelectType) {
    Object.assign(this, author);
    this.birthDate = author.birthDate
      ? author.birthDate.toISOString().split('T')[0]
      : null;
  }
}
