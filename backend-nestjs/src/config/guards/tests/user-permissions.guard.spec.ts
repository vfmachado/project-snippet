import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/enums/user-role.enum';
import { PermissionsGuard } from '../user-permissions.guard';

describe('Permissions Guard', () => {
  let permissionsGuard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    permissionsGuard = new PermissionsGuard(reflector);
  });

  it('should be defined', () => {
    expect(permissionsGuard).toBeDefined();
  });

  it('should return true if user in context has necessary permission', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['RIGHT']);

    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: {
        roles: [{ description: UserRole.Admin, permissions: ['RIGHT'] }],
      },
    });

    expect(await permissionsGuard.canActivate(context)).toBeTruthy();
  });

  it('should return false if user in context does not have the necessary permission', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['RIGHT']);

    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: {
        roles: [{ description: UserRole.Admin, permissions: ['WRONG'] }],
      },
    });

    expect(await permissionsGuard.canActivate(context)).toBeFalsy();
  });
});
