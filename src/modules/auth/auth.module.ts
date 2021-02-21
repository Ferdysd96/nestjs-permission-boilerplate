import { UsersRepository } from '../admin/access/users/users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([
            UsersRepository
        ]),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get('TOKEN_SECRET'),
                signOptions: {
                    expiresIn: config.get('ACCESS_TOKEN_EXPIRES_IN'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        TokenService,
    ],
    exports: [
        JwtStrategy,
        PassportModule,
        TokenService,
        AuthService
    ],
})
export class AuthModule { }
