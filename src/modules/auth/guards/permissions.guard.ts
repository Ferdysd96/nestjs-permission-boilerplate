import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@admin/access/users/user.entity';
import { UserMapper } from '@admin/access/users/users.mapper';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Check if the user has permission to access the resource
   * @param context {ExecutionContext}
   * @returns{boolean}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!permissions?.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return this.matchPermissions(permissions, user);
  }

  /**
   * Verifies permissions match the user's permissions
   * @param permissions {string[]}
   * @param user {UserEntity}
   * @returns {boolean}
   */
  async matchPermissions(permissions: string[], user: UserEntity): Promise<boolean> {
    const { permissions: permissionDto, roles } = await UserMapper.toDtoWithRelations(user);

    let allPermissions: string[] = permissionDto.map(({ slug }) => slug);
    roles.forEach(({ permissions }) => {
      const rolePermissions = permissions.map(({ slug }) => slug);
      allPermissions = allPermissions.concat(rolePermissions);
    });

    return permissions.some((permission) => allPermissions?.includes(permission));
  }
}
