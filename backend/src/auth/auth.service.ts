import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateDto } from '../dto/CreateDto.dto';
import { LoginDto } from '../dto/LoginDto.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Register user
  async register(dto: CreateDto) {
    return await this.usersService.create(dto);
  }

  // Update token
  async refreshToken(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
        algorithms: ['HS256'],
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }

      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      this.logger.error('Unexpected error during token verify', error);
      throw error;
    }

    // If DataBase throw, so will be 500 response.
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      this.logger.warn(`Refresh attempt for unknown user: ${payload.sub}`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash ?? '',
    );

    // Token valid by sign, but not compare with save hash, so was logout with the other device
    if (!isValid) {
      this.logger.warn(`Refresh token mismatch for user; ${user.id}`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  // Login user
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Checking if a user, exists or not.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPassword = await bcrypt.compare(dto.password, user.passwordHash);

    // Checking if a password, exists or not.
    if (!isPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
      },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      refresh_token: refreshToken,
    };
  }

  async logout(userId: string) {
    return await this.usersService.clearRefreshToken(userId);
  }
}
