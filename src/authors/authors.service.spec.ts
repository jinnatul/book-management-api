import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './authors.repository';
import { BooksService } from '../books/books.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { BadRequestException, Logger } from '@nestjs/common';

describe('AuthorsService', () => {
  let service: AuthorsService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    authorExists: jest.fn(),
  };

  const mockBooksService = {
    hasBooksByAuthor: jest.fn(),
  };

  const sampleAuthor = {
    id: 'uuid-1234',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Sci-fi author',
    birthDate: new Date('1980-01-15'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: AuthorsRepository, useValue: mockRepository },
        { provide: BooksService, useValue: mockBooksService },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);

    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  describe('create', () => {
    it('should create and return an author', async () => {
      mockRepository.create.mockResolvedValue(sampleAuthor);

      const dto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Sci-fi author',
        birthDate: new Date('1980-01-15'),
      };

      const result = await service.create(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(sampleAuthor);
    });
  });

  describe('findAll', () => {
    it('should return a list of authors', async () => {
      mockRepository.findAll.mockResolvedValue([sampleAuthor]);

      const result = await service.findAll('1', '10', 'John');
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([sampleAuthor]);
    });
  });

  describe('findById', () => {
    it('should return an author by ID', async () => {
      mockRepository.findById.mockResolvedValue(sampleAuthor);

      const result = await service.findById('uuid-1234');
      expect(mockRepository.findById).toHaveBeenCalledWith('uuid-1234');
      expect(result).toEqual(sampleAuthor);
    });
  });

  describe('update', () => {
    it('should update and return an author', async () => {
      const updatedAuthor = { ...sampleAuthor, firstName: 'Updated' };
      mockRepository.update.mockResolvedValue(updatedAuthor);

      const dto: UpdateAuthorDto = {
        firstName: 'Updated',
      };

      const result = await service.update('uuid-1234', dto);
      expect(mockRepository.update).toHaveBeenCalledWith('uuid-1234', dto);
      expect(result.firstName).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove an author if no books exist', async () => {
      mockBooksService.hasBooksByAuthor.mockResolvedValue(false);
      mockRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove('uuid-1234')).resolves.toBeUndefined();
      expect(mockBooksService.hasBooksByAuthor).toHaveBeenCalledWith(
        'uuid-1234',
      );
      expect(mockRepository.remove).toHaveBeenCalledWith('uuid-1234');
    });

    it('should throw error if author has books', async () => {
      mockBooksService.hasBooksByAuthor.mockResolvedValue(true);

      await expect(service.remove('uuid-1234')).rejects.toThrow(
        new BadRequestException(
          'Author has existing books and cannot be removed.',
        ),
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('authorExists', () => {
    it('should return true if author exists', async () => {
      mockRepository.authorExists.mockResolvedValue(true);

      const result = await service.authorExists('uuid-1234');
      expect(mockRepository.authorExists).toHaveBeenCalledWith('uuid-1234');
      expect(result).toBe(true);
    });
  });
});
