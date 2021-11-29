import { PermissionEntity } from './permission.entity';
import { CreatePermissionRequestDto, UpdatePermissionRequestDto, PermissionResponseDto } from './dtos';

export class PermissionMapper {
  public static toDto(entity: PermissionEntity): PermissionResponseDto {
    const dto = new PermissionResponseDto();
    dto.id = entity.id;
    dto.slug = entity.slug;
    dto.description = entity.description;
    dto.active = entity.active;
    return dto;
  }

  public static toCreateEntity(dto: CreatePermissionRequestDto): PermissionEntity {
    const entity = new PermissionEntity();
    entity.slug = dto.slug;
    entity.description = dto.description;
    entity.active = true;
    return entity;
  }

  public static toUpdateEntity(entity: PermissionEntity, dto: UpdatePermissionRequestDto): PermissionEntity {
    entity.slug = dto.slug;
    entity.description = dto.description;
    entity.active = dto.active;
    return entity;
  }
}
