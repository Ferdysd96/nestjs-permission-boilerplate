import { PermissionResponseDto } from '../../permissions/dtos';

export class RoleResponseDto {
  id: number;
  name: string;
  permissions: PermissionResponseDto[];
  active: boolean;
}
