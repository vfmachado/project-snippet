import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRepository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { OrganizationUsers } from 'src/organizations/entities/organization-users.entity';
import { PermissionsGuard } from './user-permissions.guard';

@Injectable()
export class UserOrganizationGuard
  extends PermissionsGuard
  implements CanActivate
{
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const organizationId =
      request.params.organization_id ||
      request.query.organizationId ||
      request.body.organizationId;

    console.log('\n==== UserOrganizationGuard ====');
    console.log('Request user\n', JSON.stringify(request.user, null, 2));
    console.log('OrganizationId', organizationId);
    console.log('\n===========================\n\n');

    const user = request.user as User;
    const hasPermissions = await super.canActivate(context);

    if (hasPermissions) return true;

    const orgUsersRepository = getRepository(OrganizationUsers);
    const relation = await orgUsersRepository.findOne({
      where: { userId: user.id, organizationId: organizationId },
    });
    if (relation) return true;

    //USER DOES NOT HAVE PERMISSION AND IS NOT ASSOCIATED TO THE ORGANIZATION
    return false;
  }
}
