import {IsBoolean, IsNotEmpty, Length, Matches, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

const slugRegex = /^[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*$/;
export class UpdatePermissionRequestDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @Matches(slugRegex)
    @MaxLength(60)
    slug: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(3, 160)
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}
