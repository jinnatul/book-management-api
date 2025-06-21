import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from './entities';

@Injectable()
export class AuthorsService {
  constructor(private repository: AuthorsRepository) {}

  create(data: CreateAuthorDto): Promise<Author> {
    return this.repository.create(data);
  }

  findAll(): Promise<Author[]> {
    return this.repository.findAll();
  }

  findById(id: string): Promise<Author> {
    return this.repository.findById(id);
  }

  update(id: string, data: UpdateAuthorDto): Promise<Author> {
    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.repository.remove(id);
  }
}
