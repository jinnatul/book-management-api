import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Server } from 'http';
import { AppModule } from '../src/app.module';
import { Author } from '../src/authors/entities/author.entity';
import { AuthorBaseSelectType } from '../src/authors/db-args';

describe('AuthorsController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let createdAuthorId: string;

  interface AuthorResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    bio: string | null;
    birthDate: string | null;
  }

  const mapResponseToAuthor = (
    res: AuthorResponseDto,
  ): AuthorBaseSelectType => ({
    ...res,
    birthDate: res.birthDate ? new Date(res.birthDate) : null,
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new author', async () => {
    const createDto = {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Award-winning sci-fi author',
      birthDate: '1980-01-15',
    };

    const response = await request(server)
      .post('/v1/authors')
      .send(createDto)
      .expect(201);

    const rawAuthor = response.body as AuthorResponseDto;
    const author = new Author(mapResponseToAuthor(rawAuthor));

    expect(author).toBeInstanceOf(Author);
    expect(author.firstName).toBe(createDto.firstName);
    expect(author.lastName).toBe(createDto.lastName);
    expect(author.birthDate).toBe(createDto.birthDate);

    createdAuthorId = author.id;
  });

  it('should retrieve the created author by ID', async () => {
    const response = await request(server)
      .get(`/v1/authors/${createdAuthorId}`)
      .expect(200);

    const rawAuthor = response.body as AuthorResponseDto;
    const author = new Author(mapResponseToAuthor(rawAuthor));

    expect(author).toBeInstanceOf(Author);
    expect(author.id).toBe(createdAuthorId);
    expect(author.firstName).toBe('John');
    expect(typeof author.birthDate).toBe('string');
  });
});
