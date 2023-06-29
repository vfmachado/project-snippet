import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class rolesPermissions1632162720721 implements MigrationInterface {
  public tableName = 'roles_permissions';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'role_id',
            type: 'int4',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'permission_id',
            type: 'int4',
            isUnique: false,
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
