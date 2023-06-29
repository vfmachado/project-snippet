import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class permissions1632165906332 implements MigrationInterface {
  public tableName = 'permissions';

  public async up(queryRunner: QueryRunner): Promise<void> {
    //
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
            name: 'action',
            type: 'varchar',
            isUnique: true,
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
