import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class SuperUserGuard implements CanActivate {
  /**
   * Verify if user is super user
   * @param context {ExecutionContext}
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    return !!user.isSuperUser;
  }
}
