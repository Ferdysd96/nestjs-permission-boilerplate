import { DBErrorCode } from '../enums';

export class DbForeignKeyError extends Error {
    code: string = DBErrorCode.PgForeignKeyConstraintViolation;
}