import { CreatePermissionRequestDto } from './create-permission-request.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionRequestDto extends CreatePermissionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
