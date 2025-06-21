import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from '../dto';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}
