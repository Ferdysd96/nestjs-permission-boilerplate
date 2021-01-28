import {
    InternalServerErrorException,
    RequestTimeoutException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import {
    CreatePermissionRequestDto,
    UpdatePermissionRequestDto,
    PermissionResponseDto,
} from './dtos';
import {
    PaginationRequest,
    PaginationResponse
} from '../../../../common/pagination';
import { PermissionExistsException } from '../../../../common/exeptions';
import { PermissionEntity } from './permission.entity';
import { DBErrorCode } from '../../../../common/enums';
import { PermissionMapper } from './permission.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeoutError } from 'rxjs';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(PermissionEntity)
        private permissionsRepository: Repository<PermissionEntity>,
    ) { }

    /**
     * Get a paginated permission list
     * @param pagination {PaginationRequest}
     */
    public async getAllPermissions(pagination: PaginationRequest): Promise<PaginationResponse<PermissionResponseDto>> {
        const { skip, limit: take, order, params: { search } } = pagination;
        const query = this.permissionsRepository.createQueryBuilder()
            .skip(skip)
            .take(take)
            .orderBy(order);

        if (search) {
            query.where('description ILIKE :search OR slug ILIKE :search', { search: `%${search}%` });
        }

        const totalPermissions = await query.getCount();
        const permissionEntities = await query.getMany();

        if (!permissionEntities?.length || totalPermissions === 0) {
            throw new NotFoundException();
        }
        const permissionDtos = await Promise.all(
            permissionEntities.map(PermissionMapper.toDto),
        );
        return PaginationResponse.of(
            pagination,
            totalPermissions,
            permissionDtos,
        );
    }

    /**
     * Get permission by id
     * @param id {number}
     */
    public async getPermissionById(id: number): Promise<PermissionResponseDto> {
        const permissionEntity = await this.permissionsRepository.findOne(id);
        if (!permissionEntity) {
            throw new NotFoundException();
        }

        return PermissionMapper.toDto(permissionEntity);
    }

    /**
     * Create new permission
     * @param permissionDto {CreatePermissionRequestDto}
     */
    public async createPermission(permissionDto: CreatePermissionRequestDto): Promise<PermissionResponseDto> {
        try {
            let permissionEntity = PermissionMapper.toCreateEntity(permissionDto);
            permissionEntity = await this.permissionsRepository.save(permissionEntity);
            return PermissionMapper.toDto(permissionEntity);
        } catch (error) {
            if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
                throw new PermissionExistsException(permissionDto.slug);
            }
            if (error instanceof TimeoutError) {
                throw new RequestTimeoutException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    /**
     * Update permission by id
     * @param id {number}
     * @param permissionDto {UpdatePermissionRequestDto}
     */
    public async updatePermission(id: number, permissionDto: UpdatePermissionRequestDto): Promise<PermissionResponseDto> {

        let permissionEntity = await this.permissionsRepository.findOne(id);
        if (!permissionEntity) {
            throw new NotFoundException();
        }

        try {
            permissionEntity = PermissionMapper.toUpdateEntity(permissionEntity, permissionDto);
            permissionEntity = await this.permissionsRepository.save(permissionEntity);
            return PermissionMapper.toDto(permissionEntity);
        } catch (error) {
            if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
                throw new PermissionExistsException(permissionDto.slug);
            }
            if (error instanceof TimeoutError) {
                throw new RequestTimeoutException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}
