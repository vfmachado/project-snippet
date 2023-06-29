import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRepository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { OrganizationUsers } from 'src/organizations/entities/organization-users.entity';
import { PermissionsGuard } from './user-permissions.guard';

@Injectable()
export class UserOwnDataGuard extends PermissionsGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.params.id;

    console.log('\n==== UserOwnDataGuard ====');
    console.log('Request user\n', JSON.stringify(request.user, null, 2));
    console.log('UserId', userId);
    console.log('\n===========================\n\n');

    const user = request.user as User;

    //FIRST BECAUSE IS FASTER
    const hasPermissions = await super.canActivate(context);
    if (hasPermissions) return true;

    if (userId == user.id) return true;

    //USER DOES NOT HAVE PERMISSION AND IS NOT THE USER ITSELF
    return false;
  }
}
