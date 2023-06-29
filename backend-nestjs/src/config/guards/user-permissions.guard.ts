import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPermissions } from 'src/enums/route-permissions.enum';
import { UserRole } from 'src/enums/user-role.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionsRequired = this.reflector.get<UserPermissions[]>(
      'user-permissions',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    // console.log('\n==== PermissionsGuard ====');
    // console.log('Request user\n', JSON.stringify(request.user, null, 2));
    // console.log('Permissions Required', permissionsRequired);

    if (!permissionsRequired || !permissionsRequired.length) {
      return true;
    }

    const user = request.user as User;

    if (user.roles.some((role: any) => role.description == UserRole.Admin)) {
      return true;
    }

    const hasPermissions = () =>
      user.roles.some((role: any) =>
        role.permissions.some((permission) =>
          permissionsRequired.includes(permission),
        ),
      );
    return user && user.roles && hasPermissions();
  }
}
