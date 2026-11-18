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

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow('Email already exists');
    });
  });
});
