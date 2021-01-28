import {
    Injectable,
    ExecutionContext,
    UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import {
    InvalidTokenException
} from '@common/exeptions';
import { TokenService } from '../services';
import { TokenType } from '../enums';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(
        private tokenService: TokenService
    ) {
        super();
    }

    /**
     * Verify the token is valid
     * @param context {ExecutionContext}
     * @returns super.canActivate(context)
     */
    canActivate(context: ExecutionContext) {

        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
            context.switchToHttp().getRequest(),
        );
        if (!accessToken) {
            throw new InvalidTokenException();
        }

        const payload = this.tokenService.verifyToken(accessToken, TokenType.AccessToken);
        if (!payload) {
            throw new UnauthorizedException();
        }
        return super.canActivate(context);
    }

    /**
     * 
     * @param error 
     * @param user 
     * @returns user || error
     */
    handleRequest(error, user) {
        if (error || !user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
