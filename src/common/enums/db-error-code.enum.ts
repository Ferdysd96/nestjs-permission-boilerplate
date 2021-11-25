export enum DBErrorCode {
  PgNotNullConstraintViolation = '23502',
  PgForeignKeyConstraintViolation = '23503',
  PgUniqueConstraintViolation = '23505',
}
