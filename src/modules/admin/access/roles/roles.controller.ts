import {
    ValidationPipe,
    ParseIntPipe,
    Controller, 
    UseGuards,
    Param,
    Body,
    Get,
    Post,
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
    PaginationResponse,
    PaginationRequest,
    PaginationParams,
} from '@common/pagination';
import {
    UpdateRoleRequestDto,
    CreateRoleRequestDto,
    RoleResponseDto,
} from './dtos';
import { RolesService } from './roles.service';
import {
    PermissionsGuard,
    JwtAuthGuard,
    Permissions,
    TOKEN_NAME
} from '@auth';

@ApiTags('Roles')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access/roles')
export class RolesController {

    constructor(private RolesService: RolesService) { }

    @ApiOperation({ description: 'Get a paginated role list' })
    @ApiQuery({ name: 'page', type: 'number', required: false, example: '1' })
    @ApiQuery({ name: 'limit', type: 'number', required: false, example: '20' })
    @ApiQuery({ name: 'orderBy', type: 'String', required: false, example: 'name' })
    @ApiQuery({ name: 'orderDirection', enum: ['ASC', 'DESC'], required: false })
    @ApiQuery({ name: 'search', type: 'string', required: false, example: 'admin' })
    @ApiOkResponse({ description: 'Roles found' })
    @ApiNotFoundResponse({ description: 'Roles not found' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions(
        'admin.access.roles.read',
        'admin.access.roles.create',
        'admin.access.roles.update'
    )
    @Get()
    public getRoles(
        @PaginationParams() pagination: PaginationRequest,
    ): Promise<PaginationResponse<RoleResponseDto>> {
        return this.RolesService.getRoles(pagination);
    }

    @ApiOperation({ description: 'Get role by id' })
    @ApiOkResponse({ description: 'Role found' })
    @ApiNotFoundResponse({ description: 'Role not found' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions(
        'admin.access.roles.read',
        'admin.access.roles.create',
        'admin.access.roles.update'
    )
    @Get('/:id')
    public getRoleById(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
        return this.RolesService.getRoleById(id);
    }

    @ApiOperation({ description: 'Create new role' })
    @ApiOkResponse({ description: 'Role created' })
    @ApiConflictResponse({ description: 'Role already exists' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions('admin.access.roles.create')
    @Post()
    public createRole(
        @Body(ValidationPipe) roleDto: CreateRoleRequestDto,
    ): Promise<RoleResponseDto> {
        return this.RolesService.createRole(roleDto);
    }

    @ApiOperation({ description: 'Update role by id' })
    @ApiOkResponse({ description: 'Role updated' })
    @ApiNotFoundResponse({ description: 'Role not found' })
    @ApiConflictResponse({ description: 'Role already exists' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions('admin.access.roles.update')
    @Put('/:id')
    public updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) roleDto: UpdateRoleRequestDto,
    ): Promise<RoleResponseDto> {
        return this.RolesService.updateRole(id, roleDto)
    };
}
