import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { UserPermissions } from 'src/enums/route-permissions.enum';

export const Permissions = (
  ...permissions: UserPermissions[]
): CustomDecorator<string> => {
  return SetMetadata('user-permissions', permissions);
};
