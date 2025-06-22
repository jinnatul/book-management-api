import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  isDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    example: 'Award-winning author of science fiction books.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '1980-01-15' })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) =>
    isDateString(value) ? new Date(value as string) : (value as never),
  )
  birthDate?: Date | null;
}
