import {
    InternalServerErrorException,
    RequestTimeoutException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import {
    CreateRoleRequestDto,
    UpdateRoleRequestDto,
    RoleResponseDto,
} from './dtos';
import {
    PaginationRequest,
    PaginationResponse
} from '@common/pagination';
import {
    ForeignKeyConflictException,
    RoleExistsException
} from '@common/exeptions';
import { DBErrorCode } from '@common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleMapper } from './role.mapper';
import { Repository } from 'typeorm';
import { TimeoutError } from 'rxjs';
import { RoleEntity } from './role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity)
        private rolesRepository: Repository<RoleEntity>,
    ) { }

    /**
     * Get a paginated role list
     * @param pagination {PaginationRequest}
     */
    public async getAllRoles(pagination: PaginationRequest): Promise<PaginationResponse<RoleResponseDto>> {
        const { skip, limit: take, order, params: { search } } = pagination;
        const query = this.rolesRepository.createQueryBuilder('r')
            .innerJoinAndSelect('r.permissions', 'p')
            .skip(skip)
            .take(take)
            .orderBy(order);

        if (search) {
            query.where('name ILIKE :search', { search: `%${search}%` });
        }

        const totalRoles = await query.getCount();
        const roleEntities = await query.getMany();

        if (!roleEntities?.length || totalRoles === 0) {
            throw new NotFoundException();
        }
        const roleDtos = await Promise.all(
            roleEntities.map(RoleMapper.toDtoWithRelations),
        );
        return PaginationResponse.of(
            pagination,
            totalRoles,
            roleDtos,
        );
    }

    /**
     * Get role by id
     * @param id {number}
     */
    public async getRoleById(id: number): Promise<RoleResponseDto> {
        const roleEntity = await this.rolesRepository.findOne(id, {
            relations: ['permissions']
        });
        if (!roleEntity) {
            throw new NotFoundException();
        }

        return RoleMapper.toDtoWithRelations(roleEntity);
    }

    /**
     * Create new role
     * @param roleDto {CreateRoleRequestDto}
     */
    public async createRole(roleDto: CreateRoleRequestDto): Promise<RoleResponseDto> {
        try {
            let roleEntity = RoleMapper.toCreateEntity(roleDto);
            roleEntity = await this.rolesRepository.save(roleEntity);
            return RoleMapper.toDto(roleEntity);
        } catch (error) {

            if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
                throw new RoleExistsException(roleDto.name);
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
     * Update role by id
     * @param id {number}
     * @param roleDto {UpdateRoleRequestDto}
     */
    public async updateRole(id: number, roleDto: UpdateRoleRequestDto): Promise<RoleResponseDto> {

        let roleEntity = await this.rolesRepository.findOne(id);
        if (!roleEntity) {
            throw new NotFoundException();
        }

        try {
            roleEntity = RoleMapper.toUpdateEntity(roleEntity, roleDto);
            roleEntity = await this.rolesRepository.save(roleEntity);
            return RoleMapper.toDto(roleEntity);
        } catch (error) {
            if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
                throw new RoleExistsException(roleDto.name);
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
}
