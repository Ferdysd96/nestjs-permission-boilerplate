import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from '../../enums';

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.AccessTokenExpired,
      message: 'Access token has expired',
    });
  }
}
