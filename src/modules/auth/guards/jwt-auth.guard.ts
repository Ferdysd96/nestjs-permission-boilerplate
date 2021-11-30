import { Reflector } from '@nestjs/core';
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { InvalidTokenException } from '@common/http/exceptions';
import { TokenService } from '../services';
import { TokenType } from '../enums';
import { SKIP_AUTH } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private tokenService: TokenService, private reflector: Reflector) {
    super();
  }

  /**
   * Verify the token is valid
   * @param context {ExecutionContext}
   * @returns super.canActivate(context)
   */
  canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [context.getHandler(), context.getClass()]);
    if (skipAuth) {
      return true;
    }

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(context.switchToHttp().getRequest());
    if (!accessToken) {
      throw new InvalidTokenException();
    }

    const payload = this.tokenService.verifyToken(accessToken, TokenType.AccessToken);
    if (!payload) {
      throw new UnauthorizedException();
    }
    return super.canActivate(context);
  }

  /**
   * Handle request and verify if exist an error or there's not user
   * @param error
   * @param user
   * @returns user || error
   */
  handleRequest(error, user) {
    if (error || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
