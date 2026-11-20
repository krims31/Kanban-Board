import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
type PrismaMock = {
  user: {
    create: jest.Mock;
    update: jest.Mock;
    findUnique: jest.Mock;
  };
};

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user in the DataBase.', async () => {
      // Arrange
      const dto = {
        username: 'User',
        email: 'a@b.c',
        password: '123',
      };

      const createdUser = {
        id: '1',
        username: 'User',
        email: 'a@b.c',
        createdAt: new Date('2026-01-01'),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      prisma.user.create.mockResolvedValue(createdUser);

      // Act
      const result = await service.create(dto);

      // Assets
      expect(result).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: 'User',
          email: 'a@b.c',
          passwordHash: 'hashed-password',
        },
        select: { id: true, username: true, email: true, createdAt: true },
      });
    });

    it('throws ConflictException when email already exists (P2002)', async () => {
      // Arrange
      const dto = {
        username: 'User',
        email: 'a@b.c',
        password: '123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      prisma.user.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '7.10.0',
          meta: { target: ['email'] },
        }),
      );

      // Act & Assert
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow('Email already exists');
    });
  });

  describe('save', () => {
    it('save a hash refresh-token in the data base.', async () => {
      // Arrange
      const updatedUser = {
        id: 'UserId1',
        username: 'User',
        email: 'a@b.c',
        refreshTokenHash: 'hashed-refresh-token',
        createdAt: new Date(),
        role: 'USER',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');

      prisma.user.update.mockResolvedValue(updatedUser);
      // Act
      const result = await service.updateRefreshToken(
        'UserId1',
        'refresh-token',
      );

      // Assets
      expect(result).toEqual(updatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('refresh-token', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'UserId1' },
        data: { refreshTokenHash: 'hashed-refresh-token' },
      });
    });
  });

  describe('clear', () => {
    it('clear a hash refresh-token.', async () => {
      // Arrange
      const clearUser = {
        id: 'UserId1',
        username: 'User',
        email: 'a@b.c',
        createdAt: new Date(),
        role: 'USER',
      };

      prisma.user.update.mockResolvedValue(clearUser);

      // Act
      const result = await service.clearRefreshToken('UserId1');

      // Assets
      expect(result).toEqual(clearUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'UserId1' },
        data: { refreshTokenHash: null },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          role: true,
        },
      });
    });
  });

  describe('findById', () => {
    it('Find a user by id.', async () => {
      // Arrange
      const findByIdUser = {
        id: 'UserId1',
        username: 'User',
        email: 'a@b.c',
        createdAt: new Date(),
        role: 'USER',
      };

      prisma.user.findUnique.mockResolvedValue(findByIdUser);

      // Act
      const result = await service.findById('UserId1');

      // Assets
      expect(result).toEqual(findByIdUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'UserId1' },
      });
    });
  });

  describe('findByEmail', () => {
    it('Find a user by email.', async () => {
      // Arrange
      const findByEmailUser = {
        id: 'UserId1',
        username: 'User',
        email: 'a@b.c',
        createdAt: new Date(),
        role: 'USER',
      };

      prisma.user.findUnique.mockResolvedValue(findByEmailUser);

      // Act
      const result = await service.findByEmail('a@b.c');

      // Assets
      expect(result).toEqual(findByEmailUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'a@b.c' },
      });
    });
  });
});
