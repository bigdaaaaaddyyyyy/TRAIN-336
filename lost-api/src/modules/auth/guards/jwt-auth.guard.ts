import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedUser } from '../decorators/current-user.decorator';
import { JwtStrategy } from '../strategies/jwt.strategy';

type AuthRequest = Request & {
  user?: AuthenticatedUser;
  cookies?: Record<string, string | undefined>;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const payload = await this.jwtStrategy.verifyToken(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: AuthRequest): string | undefined {
    const authHeader = request.headers.authorization;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length).trim();
      if (token.length > 0) {
        return token;
      }
    }

    const cookieToken = request.cookies?.lost_session;
    return typeof cookieToken === 'string' && cookieToken.length > 0
      ? cookieToken
      : undefined;
  }
}
