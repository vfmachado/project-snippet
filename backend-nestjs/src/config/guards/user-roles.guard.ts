import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/enums/user-role.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequired = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    // console.log('\n==== RolesGuard ====');
    // console.log('Request user\n', JSON.stringify(request.user, null, 2));
    // console.log('Roles Required', rolesRequired);

    if (!rolesRequired || !rolesRequired.length) {
      return true;
    }

    const user = request.user as User;
    const hasRole = () =>
      user.roles.some((role) => rolesRequired.includes(role.description));
    return user && user.roles && hasRole();
  }
}
