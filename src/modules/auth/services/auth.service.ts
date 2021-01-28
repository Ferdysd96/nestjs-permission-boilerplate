
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorType } from '@common/enums';
import {
    DisabledUserException,
    InvalidCredentialsException
} from '@common/exeptions';
import { HashHelper } from '@helpers';
import { UserStatus } from '@admin/access/users/user-status.enum';
import { UserEntity } from '@admin/access/users/user.entity';
import {
    AuthCredentialsRequestDto,
    JwtPayload,
    LoginResponseDto,
} from '../dtos';
import { TokenService } from './token.service';
import { UserMapper } from '@admin/access/users/users.mapper';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private tokenService: TokenService,
    ) { }

    /**
     * User authentication
     * @param authCredentialsDto {AuthCredentialsRequestDto}
     * @returns 
     */
    public async login({ username, password }: AuthCredentialsRequestDto): Promise<LoginResponseDto> {

        const user: UserEntity = await this.usersRepository.findOne({ username },
            { relations: ['roles', 'permissions'] }
        );

        if (!user) {
            throw new InvalidCredentialsException();
        }

        const passwordMatch = await HashHelper.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            throw new InvalidCredentialsException();
        }
        if (user.status == UserStatus.Blocked) {
            throw new DisabledUserException(ErrorType.BlockedUser);
        }
        if (user.status == UserStatus.Inactive) {
            throw new DisabledUserException(ErrorType.InactiveUser);
        }

        const payload: JwtPayload = { id: user.id, username: user.username };
        const token = await this.tokenService.generateAuthToken(payload);

        const userDto = await UserMapper.toDto(user);
        const { permissions, roles } = await UserMapper.toDtoWithRelations(user);
        const additionalPermissions = permissions.map(({ slug }) => slug);
        const mappedRoles = roles.map(({ name, permissions }) => {
            const rolePermissions = permissions.map(({ slug }) => slug);
            return {
                name,
                permissions: rolePermissions
            }
        });

        return {
            user: userDto,
            token,
            access: {
                additionalPermissions,
                roles: mappedRoles
            },
        };
    }
}