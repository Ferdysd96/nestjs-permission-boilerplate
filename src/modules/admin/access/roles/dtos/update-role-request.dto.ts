import {ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsNotEmpty, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateRoleRequestDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
    
    @ApiProperty()
    @ArrayNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    permissions: number[];

    @ApiProperty({example:[1,2]})
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}
