import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';
import { AuthorsService } from '../authors/authors.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { Book } from './entities';
import { ConflictException, BadRequestException, Logger } from '@nestjs/common';

const sampleBook: Book = {
  id: 'book-uuid',
  title: 'The Great Gatsby',
  isbn: '978-3-16-148410-0',
  publishedDate: '2020-05-01',
  genre: 'Fiction',
  author: undefined,
};

describe('BooksService', () => {
  let service: BooksService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    isbnExists: jest.fn(),
    isISBNUniqueForUpdate: jest.fn(),
    hasBooksByAuthor: jest.fn(),
  };

  const mockAuthorsService = {
    authorExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BooksRepository, useValue: mockRepository },
        { provide: AuthorsService, useValue: mockAuthorsService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);

    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  describe('create', () => {
    it('should create a book', async () => {
      const dto: CreateBookDto = {
        title: 'The Great Gatsby',
        isbn: '978-3-16-148410-0',
        publishedDate: new Date('2020-05-01'),
        genre: 'Fiction',
        authorId: 'author-uuid',
      };

      mockRepository.isbnExists.mockResolvedValue(false);
      mockAuthorsService.authorExists.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(sampleBook);

      const result = await service.create(dto);
      expect(result).toEqual(sampleBook);
    });

    it('should throw conflict error if ISBN exists', async () => {
      const dto: CreateBookDto = {
        title: 'The Great Gatsby',
        isbn: '978-3-16-148410-0',
        publishedDate: new Date('2020-05-01'),
        genre: 'Fiction',
        authorId: 'author-uuid',
      };

      mockRepository.isbnExists.mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw bad request if author not found', async () => {
      const dto: CreateBookDto = {
        title: 'The Great Gatsby',
        isbn: '978-3-16-148410-0',
        publishedDate: new Date('2020-05-01'),
        genre: 'Fiction',
        authorId: 'invalid-author',
      };

      mockRepository.isbnExists.mockResolvedValue(false);
      mockAuthorsService.authorExists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return a list of books', async () => {
      mockRepository.findAll.mockResolvedValue([sampleBook]);
      const result = await service.findAll('1', '10', 'Gatsby', 'author-uuid');
      expect(result).toEqual([sampleBook]);
    });
  });

  describe('findById', () => {
    it('should return a book by id', async () => {
      mockRepository.findById.mockResolvedValue(sampleBook);
      const result = await service.findById('book-uuid');
      expect(result).toEqual(sampleBook);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const dto: UpdateBookDto = { title: 'Updated Title' };

      mockRepository.isISBNUniqueForUpdate.mockResolvedValue(true);
      mockAuthorsService.authorExists.mockResolvedValue(true);
      mockRepository.update.mockResolvedValue({ ...sampleBook, ...dto });

      const result = await service.update('book-uuid', dto);
      expect(result.title).toBe('Updated Title');
    });

    it('should throw conflict if ISBN is duplicate', async () => {
      const dto: UpdateBookDto = { isbn: 'duplicate-isbn' };
      mockRepository.isISBNUniqueForUpdate.mockResolvedValue(false);

      await expect(service.update('book-uuid', dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw bad request if new author does not exist', async () => {
      const dto: UpdateBookDto = { authorId: 'invalid-author' };

      mockRepository.isISBNUniqueForUpdate.mockResolvedValue(true);
      mockAuthorsService.authorExists.mockResolvedValue(false);

      await expect(service.update('book-uuid', dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      mockRepository.remove.mockResolvedValue(undefined);
      await expect(service.remove('book-uuid')).resolves.toBeUndefined();
    });
  });

  describe('hasBooksByAuthor', () => {
    it('should return true if books exist for author', async () => {
      mockRepository.hasBooksByAuthor.mockResolvedValue(true);
      const result = await service.hasBooksByAuthor('author-uuid');
      expect(result).toBe(true);
    });
  });
});
