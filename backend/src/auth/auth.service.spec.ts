import { UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
type UsersMock = {
  create: jest.Mock;
  findById: jest.Mock;
  findByEmail: jest.Mock;
  updateRefreshToken: jest.Mock;
  clearRefreshToken: jest.Mock;
};

// JwtService for the sign and verify.
type jwtServiceMock = {
  sign: jest.Mock;
  verify: jest.Mock;
};

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userMock: UsersMock;
  let jwtMock: jwtServiceMock;

  beforeAll(() => {
    process.env.JWT_REFRESH_SECRET = 'test-secret';
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    userMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updateRefreshToken: jest.fn(),
      clearRefreshToken: jest.fn(),
    };
    jwtMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: userMock,
        },
        {
          provide: JwtService,
          useValue: jwtMock,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    it('create and register user', async () => {
      // Arrange
      const dto = { username: 'User', email: '@mail.ru', password: '123' };

      userMock.create.mockResolvedValue(dto);

      // Act
      const result = await service.register(dto);

      // Assert
      expect(result).toEqual(dto);
      expect(userMock.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('refreshToken', () => {
    const validRefreshToken = 'valid-refresh-token';
    const user = {
      id: 'u1',
      email: 'a@b.c',
      role: 'USER',
      refreshTokenHash: 'hashed',
    };

    // --- 1. Happy path ---
    it('returns new access_token for a valid refresh token', async () => {
      jwtMock.verify.mockReturnValue({ sub: 'u1' });
      userMock.findById.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtMock.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken(validRefreshToken);

      expect(result).toEqual({ access_token: 'new-access-token' });
      expect(jwtMock.verify).toHaveBeenCalledWith(validRefreshToken, {
        secret: 'test-secret',
        algorithms: ['HS256'],
      });
      expect(userMock.findById).toHaveBeenCalledWith('u1');
      expect(bcrypt.compare).toHaveBeenCalledWith(validRefreshToken, 'hashed');
      expect(jwtMock.sign).toHaveBeenCalledWith({
        sub: 'u1',
        email: 'a@b.c',
        role: 'USER',
      });
    });

    // --- 2. Token not valid ---
    it('throws "Refresh token expired" when token is expired', async () => {
      jwtMock.verify.mockImplementation(() => {
        throw new TokenExpiredError('expired', new Date());
      });

      await expect(service.refreshToken(validRefreshToken)).rejects.toThrow(
        'Refresh token expired',
      );
      expect(userMock.findById).not.toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    // --- 3. Not valid sign ---
    it('throws "Invalid refresh token" when signature is invalid', async () => {
      jwtMock.verify.mockImplementation(() => {
        throw new JsonWebTokenError('invalid signature');
      });

      await expect(service.refreshToken(validRefreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(userMock.findById).not.toHaveBeenCalled();
    });

    // --- 4. User not found ---
    it('throws "Invalid refresh token" when user does not exist', async () => {
      jwtMock.verify.mockReturnValue({ sub: 'ghost' });
      userMock.findById.mockResolvedValue(null);

      await expect(service.refreshToken(validRefreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtMock.sign).not.toHaveBeenCalled();
    });

    // --- 5. Hash not compare ---
    it('throws "Invalid refresh token" when hash does not match', async () => {
      jwtMock.verify.mockReturnValue({ sub: 'u1' });
      userMock.findById.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.refreshToken(validRefreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(jwtMock.sign).not.toHaveBeenCalled();
    });

    // --- 6. Error DB not mask by 401 ---
    it('propagates DB errors instead of masking them as 401', async () => {
      jwtMock.verify.mockReturnValue({ sub: 'u1' });
      userMock.findById.mockRejectedValue(new Error('DB down'));

      const promise = service.refreshToken(validRefreshToken);

      await expect(promise).rejects.toThrow('DB down');
      await expect(promise).rejects.not.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('login by email', async () => {
      // Arrange
      const dto = { email: 'a@b.c', password: '123' };
      const user = {
        id: 'u1',
        email: 'a@b.c',
        role: 'USER',
        passwordHash: 'hashed-password',
      };

      userMock.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtMock.sign
        .mockReturnValueOnce('refresh-token')
        .mockReturnValueOnce('access-token');

      // Act
      const result = await service.login(dto);

      // Assert
      expect(result).toEqual({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      });
      expect(userMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed-password');
      expect(jwtMock.sign).toHaveBeenCalledWith(
        { sub: 'u1' },
        { secret: 'test-secret', expiresIn: '7d' },
      );
      expect(userMock.updateRefreshToken).toHaveBeenCalledWith(
        'u1',
        'refresh-token',
      );
    });
  });

  describe('logout', () => {
    it('clears refresh token for the given user', async () => {
      const userId = 'user-1';

      const clearedUserId = { id: userId, refreshTokenHash: null };

      userMock.clearRefreshToken.mockResolvedValue(clearedUserId);

      const result = await service.logout(userId);

      expect(result).toEqual(clearedUserId);
      expect(userMock.clearRefreshToken).toHaveBeenCalledWith(userId);
    });

    it('propagates error from clearRefreshToken', async () => {
      userMock.clearRefreshToken.mockRejectedValue(new Error('DB down'));

      await expect(service.logout('user-1')).rejects.toThrow('DB down');
    });
  });
});
