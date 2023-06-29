import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/enums/user-role.enum';
import { RolesGuard } from '../user-roles.guard';

describe('Roles Guard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should return true if user in context has necessary role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['ADMIN']);

    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: {
        roles: [{ description: UserRole.Admin }],
      },
    });

    expect(rolesGuard.canActivate(context)).toBeTruthy();
  });

  it('should return false if user in context does not have the necessary role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['ADMIN']);

    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: {
        roles: [{ description: UserRole.Consultant }],
      },
    });

    expect(rolesGuard.canActivate(context)).toBeFalsy();
  });
});
