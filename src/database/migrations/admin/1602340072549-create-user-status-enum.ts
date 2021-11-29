import { MigrationInterface, QueryRunner } from 'typeorm';

const status = 'user_status';
export class CreateUserStatusEnum1602340072549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE ${status} AS ENUM (
                'active',
                'blocked',
                'inactive'
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE ${status}`);
  }
}
