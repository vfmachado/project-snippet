import { UserPermissions } from 'src/enums/route-permissions.enum';
import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { v4 } from 'uuid';

export class initialData1632763800644 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //FK ON ROLES PERMISSIONS
    await queryRunner.createForeignKey(
      'roles_permissions',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
      }),
    );

    await queryRunner.createForeignKey(
      'roles_permissions',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
      }),
    );

    //ROLES
    await queryRunner.manager.query(
      `INSERT INTO quitei.roles (description) VALUES ('ADMIN')`,
    );

    await queryRunner.manager.query(
      `INSERT INTO quitei.roles (description) VALUES ('CONSULTANT')`,
    );

    //PERMISSIONS
    const permissions = Object.keys(UserPermissions).map(
      (key) => UserPermissions[key],
    );
    for (let i = 0; i < permissions.length; i++) {
      await queryRunner.manager.query(
        `INSERT INTO quitei.permissions ("action")
        VALUES ('${permissions[i]}');      
        `,
      );
    }

    //ROLES-PERMISSIONS
    //SELECT ADMIN ID
    const adminRoleId = await queryRunner.manager.query(
      `SELECT id FROM quitei.roles WHERE description = 'ADMIN';`,
    );

    const consultantRoleId = await queryRunner.manager.query(
      `SELECT id FROM quitei.roles WHERE description = 'CONSULTANT';`,
    );

    //SELECT PERMISSIONS
    const permissionIDs = await queryRunner.manager.query(
      `SELECT id FROM quitei.permissions;`,
    );

    for (let i = 0; i < permissionIDs.length; i++) {
      await queryRunner.manager.query(
        `INSERT INTO quitei.roles_permissions ("role_id", "permission_id")
        VALUES (${adminRoleId[0].id}, ${permissionIDs[i].id});      
        `,
      );
    }

    //USER ADMIN - admin@quitei.co / 1234
    const adminId = v4();
    await queryRunner.manager.query(
      `INSERT INTO quitei.users ("id", "name",lastname,email,"password",cpf)
      VALUES ('${adminId}', 'Admin','Master','admin@quitei.co','$2b$10$kOP4JdVfu4xRL8EAVukSuuZe6TNAZ6/.uAnwCBxHLiOewhHukCyYe','00000000000');
    `,
    );

    //ADMIN ROLE
    await queryRunner.manager.query(
      `INSERT INTO quitei.users_roles ("user_id", "role_id")
      VALUES ('${adminId}', ${adminRoleId[0].id});      
      `,
    );

    //USER CONSULTANT - consultant@quitei.co / 1234
    const consultantId = v4();
    await queryRunner.manager.query(
      `INSERT INTO quitei.users ("id", "name",lastname,email,"password",cpf)
      VALUES ('${consultantId}', 'Consultant','Backoffice','consultant@quitei.co','$2b$10$kOP4JdVfu4xRL8EAVukSuuZe6TNAZ6/.uAnwCBxHLiOewhHukCyYe','11111111111');
    `,
    );

    //CONSULTANT ROLE
    await queryRunner.manager.query(
      `INSERT INTO quitei.users_roles ("user_id", "role_id")
      VALUES ('${consultantId}', ${consultantRoleId[0].id});      
      `,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // EMPTY FOR NOW
  }
}
