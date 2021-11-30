import { InternalServerErrorException, RequestTimeoutException, NotFoundException, Injectable } from '@nestjs/common';
import { ForeignKeyConflictException, RoleExistsException } from '@common/http/exceptions';
import { Pagination, PaginationRequest, PaginationResponseDto } from '@libs/pagination';
import { CreateRoleRequestDto, UpdateRoleRequestDto, RoleResponseDto } from './dtos';
import { RolesRepository } from './roles.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DBErrorCode } from '@common/enums';
import { RoleMapper } from './role.mapper';
import { TimeoutError } from 'rxjs';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private rolesRepository: RolesRepository,
  ) {}

  /**
   * Get a paginated role list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<RoleResponseDto>>}
   */
  public async getRoles(pagination: PaginationRequest): Promise<PaginationResponseDto<RoleResponseDto>> {
    try {
      const [roleEntities, totalRoles] = await this.rolesRepository.getRolesAndCount(pagination);

      const roleDtos = await Promise.all(roleEntities.map(RoleMapper.toDtoWithRelations));
      return Pagination.of(pagination, totalRoles, roleDtos);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Get role by id
   * @param id {number}
   * @returns {Promise<RoleResponseDto>}
   */
  public async getRoleById(id: number): Promise<RoleResponseDto> {
    const roleEntity = await this.rolesRepository.findOne(id, {
      relations: ['permissions'],
    });
    if (!roleEntity) {
      throw new NotFoundException();
    }

    return RoleMapper.toDtoWithRelations(roleEntity);
  }

  /**
   * Create new role
   * @param roleDto {CreateRoleRequestDto}
   * @returns {Promise<RoleResponseDto>}
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
        error.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        error.code == DBErrorCode.PgNotNullConstraintViolation
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
   * @returns {Promise<RoleResponseDto>}
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
        error.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        error.code == DBErrorCode.PgNotNullConstraintViolation
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
