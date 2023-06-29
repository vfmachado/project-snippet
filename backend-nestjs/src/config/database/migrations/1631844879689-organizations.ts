import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class organizations1631844879689 implements MigrationInterface {
  public tableName = 'organizations';

  public async up(queryRunner: QueryRunner): Promise<void> {
    //
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'commertial_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'company_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'segment_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'postal_code',
            type: 'varchar',
            isNullable: true,
            length: '10',
          },
          {
            name: 'country',
            type: 'varchar',
            isNullable: true,
            length: '20',
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: true,
            length: '20',
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
            length: '30',
          },
          {
            name: 'neighborhood',
            type: 'varchar',
            isNullable: true,
            length: '20',
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
            length: '200',
          },
          {
            name: 'number',
            type: 'varchar',
            isNullable: true,
            length: '6',
          },
          {
            name: 'complement',
            type: 'varchar',
            isNullable: true,
            length: '100',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
