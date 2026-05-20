import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiResponseDto } from '../common/types/api-response.type';

import { JwtPayload } from '../common/types/jwt-payload.type';
import { comparePassword, hashPassword } from '../common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<ApiResponseDto<{ id: string }>> {
    const existingAuthor = await this.prisma.author.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (existingAuthor) {
      throw new BadRequestException('author already exists');
    }

    const hashedPassword = await hashPassword(dto.password);

    const author = await this.prisma.author.create({
      data: {
        username: dto.username,
        password: hashedPassword,
      },
    });

    return {
      message: 'author registered successfully',
      data: { id: author.id },
    };
  }

  async login(
    dto: LoginDto,
  ): Promise<ApiResponseDto<{ access_token: string }>> {
    const author = await this.prisma.author.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (!author) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await comparePassword(dto.password, author.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: author.id,
      username: author.username,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      data: { access_token: token },
    };
  }
}
