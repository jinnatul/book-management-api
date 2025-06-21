import { Transform } from 'class-transformer';
import {
  IsDate,
  isDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) =>
    isDateString(value) ? new Date(value as string) : (value as never),
  )
  birthDate?: Date | null;
}
