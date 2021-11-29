import { MigrationInterface, QueryRunner } from 'typeorm';

const schemaName = 'admin';
export class CreateAdminSchema_1602337241496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema(schemaName, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema(schemaName, true, true);
  }
}
