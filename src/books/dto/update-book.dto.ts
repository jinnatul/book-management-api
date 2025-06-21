import { PartialType } from '@nestjs/mapped-types';

import { CreateBookDto } from '../dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
