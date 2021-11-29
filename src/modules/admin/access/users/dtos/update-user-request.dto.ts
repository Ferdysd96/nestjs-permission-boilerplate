import { ArrayNotEmpty, IsAlphanumeric, IsArray, IsEnum, IsInt, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../user-status.enum';

export class UpdateUserRequestDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({
    example: 'jdoe',
  })
  username: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({ example: [1, 2] })
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  permissions: number[];

  @ApiProperty({ example: [1, 2] })
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  roles: number[];

  @IsEnum(UserStatus)
  @ApiProperty({
    example: UserStatus.Active,
  })
  status: UserStatus;
}
