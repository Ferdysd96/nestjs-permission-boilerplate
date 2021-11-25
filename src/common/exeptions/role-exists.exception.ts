import { ConflictException } from '@nestjs/common';
import { ErrorType } from '../enums';

export class RoleExistsException extends ConflictException {
  constructor(name: string) {
    super({
      errorType: ErrorType.RoleExists,
      message: `There's a role with name '${name}'`,
    });
  }
}
