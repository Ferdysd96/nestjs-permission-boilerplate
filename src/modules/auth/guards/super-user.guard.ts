
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class SuperUserGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();
        return !!user.isSuperUser;
    }
}