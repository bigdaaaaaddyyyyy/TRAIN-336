import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedUser } from '../decorators/current-user.decorator';

@Injectable()
export class JwtStrategy {
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    const payload: unknown = await this.jwtService.verifyAsync(token);

    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('sub' in payload) ||
      typeof payload.sub !== 'string' ||
      payload.sub.length === 0
    ) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return { sub: payload.sub };
  }
}