import {
    InternalServerErrorException,
    RequestTimeoutException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import {
    ChangePasswordRequestDto,
    CreateUserRequestDto,
    UpdateUserRequestDto,
    UserResponseDto,
} from './dtos';
import {
    PaginationRequest,
    PaginationResponse
} from '@common/pagination';
import {
    InvalidCurrentPasswordException,
    ForeignKeyConflictException,
    UserExistsException,
} from '@common/exeptions';
import { DBErrorCode } from '@common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMapper } from './users.mapper';
import { Repository } from 'typeorm';
import { TimeoutError } from 'rxjs';
import { UserEntity } from './user.entity';
import { HashHelper } from '@helpers';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) { }

    /**
     * Get a paginated user list
     * @param pagination {PaginationRequest}
     */
    public async getAllUsers(pagination: PaginationRequest): Promise<PaginationResponse<UserResponseDto>> {
        const { skip, limit: take, order, params: { search } } = pagination;
        const query = this.usersRepository.createQueryBuilder('u')
            .innerJoinAndSelect('u.roles', 'r')
            .leftJoinAndSelect('u.permissions', 'p')
            .skip(skip)
            .take(take)
            .orderBy(order);

        if (search) {
            query.where(`
            u.username ILIKE :search
            OR u.first_name ILIKE :search
            OR u.last_name ILIKE :search
            `, { search: `%${search}%` }
            );
        }

        const totalUsers = await query.getCount();
        const userEntities = await query.getMany();

        if (!userEntities?.length || totalUsers === 0) {
            throw new NotFoundException();
        }
        const UserDtos = await Promise.all(
            userEntities.map(UserMapper.toDtoWithRelations),
        );
        return PaginationResponse.of(
            pagination,
            totalUsers,
            UserDtos,
        );
    }

    /**
     * Get user by id
     * @param id {string}
     */
    public async getUserById(id: string): Promise<UserResponseDto> {
        const userEntity = await this.usersRepository.findOne(id, {
            relations: ['permissions', 'roles']
        });
        if (!userEntity) {
            throw new NotFoundException();
        }

        return UserMapper.toDtoWithRelations(userEntity);
    }

    /**
     * Create new user
     * @param userDto {CreateUserRequestDto}
     */
    public async createUser(userDto: CreateUserRequestDto): Promise<UserResponseDto> {
        try {
            let userEntity = UserMapper.toCreateEntity(userDto);
            userEntity.password = await HashHelper.encrypt(userEntity.password);
            userEntity = await this.usersRepository.save(userEntity);
            return UserMapper.toDto(userEntity);
        } catch (error) {

            if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
                throw new UserExistsException(userDto.username);
            }
            if (
                error.code == DBErrorCode.PgForeignKeyConstraintViolation
                || error.code == DBErrorCode.PgNotNullConstraintViolation
            ) {
                throw new ForeignKeyConflictException();
            }
            if (error instanceof TimeoutError) {
                throw new RequestTimeoutException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    /**
     * Update User by id
     * @param id {string}
     * @param userDto {UpdateUserRequestDto}
     */
    public async updateUser(id: string, userDto: UpdateUserRequestDto): Promise<UserResponseDto> {

        let userEntity = await this.usersRepository.findOne(id);
        if (!userEntity) {
            throw new NotFoundException();
        }

        try {
            userEntity = UserMapper.toUpdateEntity(userEntity, userDto);
            userEntity = await this.usersRepository.save(userEntity);
            return UserMapper.toDto(userEntity);
        } catch (error) {
            if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
                throw new UserExistsException(userDto.username);
            }
            if (
                error.code == DBErrorCode.PgForeignKeyConstraintViolation
                || error.code == DBErrorCode.PgNotNullConstraintViolation
            ) {
                throw new ForeignKeyConflictException();
            }
            if (error instanceof TimeoutError) {
                throw new RequestTimeoutException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    /**
     * Change user password
     * @param changePassword {ChangePasswordRequestDto}
     * @param user {string}
     */
    public async changePassword(changePassword: ChangePasswordRequestDto, userId: string): Promise<UserResponseDto> {

        const { currentPassword, newPassword } = changePassword;

        const userEntity = await this.usersRepository.findOne({ id: userId });

        if (!userEntity) {
            throw new NotFoundException();
        }

        const passwordMatch = await HashHelper.compare(currentPassword, userEntity.password);

        if (!passwordMatch) {
            throw new InvalidCurrentPasswordException();
        }

        try {
            userEntity.password = await HashHelper.encrypt(newPassword);
            await this.usersRepository.save(userEntity);
            return UserMapper.toDto(userEntity);
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new RequestTimeoutException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}
