import { ConflictException } from '@nestjs/common';
import { ErrorType } from '../../enums';

export class UserExistsException extends ConflictException {
  constructor(username: string) {
    super({
      errorType: ErrorType.UserExists,
      message: `There's a user with username '${username}'`,
    });
  }
}
