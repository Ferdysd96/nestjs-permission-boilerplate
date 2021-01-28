import { PermissionResponseDto } from '../../permissions/dtos';
import { RoleResponseDto } from '../../roles/dtos';
import { UserStatus } from '../user-status.enum';

export class UserResponseDto {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles?: RoleResponseDto[];
  permissions?: PermissionResponseDto[];
  isSuperUser: boolean;
  status: UserStatus;
}
