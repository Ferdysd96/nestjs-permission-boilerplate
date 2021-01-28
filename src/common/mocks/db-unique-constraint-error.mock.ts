import { DBErrorCode } from '../enums';

export class DbUniqueConstraintError extends Error {
    code: string = DBErrorCode.PgUniqueConstraintViolation;
}