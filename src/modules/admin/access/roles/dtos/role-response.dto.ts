import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permissions/dtos';

export class RoleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  permissions: PermissionResponseDto[];

  @ApiProperty()
  active: boolean;
}
