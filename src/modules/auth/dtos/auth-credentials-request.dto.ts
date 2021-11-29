import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsRequestDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'jDoe',
  })
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Hello123',
  })
  readonly password: string;
}
