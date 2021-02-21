import {
    ValidationPipe,
    ParseUUIDPipe,
    Controller,
    UseGuards,
    Param,
    Post,
    Body,
    Get,
    Put,
} from '@nestjs/common';
import {
    ApiInternalServerErrorResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import {
    PermissionsGuard,
    JwtAuthGuard,
    CurrentUser,
    Permissions,
    TOKEN_NAME,
} from '@auth';
import {
    PaginationResponse,
    PaginationRequest,
    PaginationParams,
} from '@common/pagination';
import {
    ChangePasswordRequestDto,
    CreateUserRequestDto,
    UpdateUserRequestDto,
    UserResponseDto,
} from './dtos';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access/users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @ApiOperation({ description: 'Get a paginated user list' })
    @ApiQuery({ name: 'page', type: 'number', required: false, example: '1' })
    @ApiQuery({ name: 'limit', type: 'number', required: false, example: '20' })
    @ApiQuery({ name: 'orderBy', type: 'String', required: false, example: 'username' })
    @ApiQuery({ name: 'orderDirection', enum: ['ASC', 'DESC'], required: false })
    @ApiQuery({ name: 'search', type: 'string', required: false, example: 'admin' })
    @ApiOkResponse({ description: 'Users found' })
    @ApiNotFoundResponse({ description: 'Users not found' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions(
        'admin.access.users.read',
        'admin.access.users.create',
        'admin.access.users.update'
    )
    @Get()
    public getUsers(
        @PaginationParams() pagination: PaginationRequest,
    ): Promise<PaginationResponse<UserResponseDto>> {
        return this.usersService.getUsers(pagination);
    }

    @ApiOperation({ description: 'Get user by id' })
    @ApiOkResponse({ description: 'User found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions(
        'admin.access.users.read',
        'admin.access.users.create',
        'admin.access.users.update'
    )
    @Get('/:id')
    public getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        return this.usersService.getUserById(id);
    }

    @ApiOperation({ description: 'Create new user' })
    @ApiOkResponse({ description: 'User created' })
    @ApiConflictResponse({ description: 'User already exists' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions('admin.access.users.create')
    @Post()
    public createUser(
        @Body(ValidationPipe) UserDto: CreateUserRequestDto,
    ): Promise<UserResponseDto> {
        return this.usersService.createUser(UserDto);
    }

    @ApiOperation({ description: 'Update user by id' })
    @ApiOkResponse({ description: 'User updated' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiConflictResponse({ description: 'User already exists' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions('admin.access.users.update')
    @Put('/:id')
    public updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) UserDto: UpdateUserRequestDto,
    ): Promise<UserResponseDto> {
        return this.usersService.updateUser(id, UserDto)
    };

    @ApiOperation({ description: 'User password changed' })
    @ApiOkResponse({ description: 'User updated' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Post('/change/password')
    changePassword(
        @Body(ValidationPipe) changePassword: ChangePasswordRequestDto,
        @CurrentUser() user: UserEntity,
    ): Promise<UserResponseDto> {
        return this.usersService.changePassword(changePassword, user.id);
    }
}
