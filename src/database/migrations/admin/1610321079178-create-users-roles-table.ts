import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'admin.users_roles',
  usersTableName = 'admin.users',
  rolesTableName = 'admin.roles';
export class createUsersRolesTable1610321079178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'integer',
            isPrimary: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: usersTableName,
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['role_id'],
            referencedColumnNames: ['id'],
            referencedTableName: rolesTableName,
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //If table has foreingn keys, third parameter must to be true
    await queryRunner.dropTable(tableName, true, true);
  }
}
