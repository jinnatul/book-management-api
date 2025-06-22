import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: '978-3-16-148410-0' })
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '2020-05-01' })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) =>
    isDateString(value) ? new Date(value as string) : (value as never),
  )
  publishedDate?: Date | null;

  @ApiPropertyOptional({ example: 'Fiction' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ example: '15b3e0b4-58b5-4ef9-9b5f-b332a9e1d38f' })
  @IsNotEmpty()
  @IsUUID()
  authorId: string;
}
