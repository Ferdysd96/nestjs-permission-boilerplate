import { ForbiddenException } from '@nestjs/common';
import { ErrorType } from '../../enums';

export class InvalidCurrentPasswordException extends ForbiddenException {
  constructor() {
    super({
      errorType: ErrorType.InvalidCurrentPassword,
      message: 'The current password is invalid',
    });
  }
}
