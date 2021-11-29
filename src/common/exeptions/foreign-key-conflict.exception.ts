import { ConflictException } from '@nestjs/common';
import { ErrorType } from '../enums';

export class ForeignKeyConflictException extends ConflictException {
  constructor() {
    super({
      errorType: ErrorType.ForeignKeyConflict,
      message: `Foreign key conflict`,
    });
  }
}
