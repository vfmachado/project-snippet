import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ratePolicies1633976345962 implements MigrationInterface {
  public tableName = 'organization_rate_policies';

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
            name: 'organization_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'interest_rate',
            type: 'real',
            isNullable: false,
          },
          {
            name: 'interest_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'interest_monthly',
            type: 'real',
            isNullable: false,
          },
          {
            name: 'fee_rate',
            type: 'real',
            isNullable: false,
          },
          {
            name: 'debt_age_start',
            type: 'int2',
            isNullable: false,
          },
          {
            name: 'debt_age_end',
            type: 'int2',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
