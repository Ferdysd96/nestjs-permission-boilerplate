import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from '../../enums';

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.RefreshTokenExpired,
      message: 'Refresh token has expired',
    });
  }
}
