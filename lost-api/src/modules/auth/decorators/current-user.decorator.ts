import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export interface AuthenticatedUser {
  sub: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const user = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>().user;

    if (!user || typeof user.sub !== 'string' || user.sub.length === 0) {
      throw new UnauthorizedException('Authenticated user is not available');
    }

    return user;
  },
);