import { Transform } from 'class-transformer';
import {
  IsDate,
  isDateString,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) =>
    isDateString(value) ? new Date(value as string) : (value as never),
  )
  publishedDate?: Date | null;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsNotEmpty()
  @IsUUID()
  authorId: string;
}
