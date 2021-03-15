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
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import {
    PermissionsGuard,
    SuperUserGuard,
    JwtAuthGuard,
    Permissions,
    TOKEN_NAME,
} from '@auth';
import {
    PaginationResponse,
    PaginationRequest,
    PaginationParams,
} from '@common/pagination';
import {
    CreatePermissionRequestDto,
    UpdatePermissionRequestDto,
    PermissionResponseDto,
} from './dtos';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
)
@Controller('access/permissions')
export class PermissionsController {

    constructor(private permissionsService: PermissionsService) { }

    @ApiOperation({ description: 'Get a paginated permission list' })
    @ApiQuery({ name: 'page', type: 'number', required: false, example: '1' })
    @ApiQuery({ name: 'limit', type: 'number', required: false, example: '20' })
    @ApiQuery({ name: 'orderBy', type: 'String', required: false, example: 'description' })
    @ApiQuery({ name: 'orderDirection', enum: ['ASC', 'DESC'], required: false })
    @ApiQuery({ name: 'search', type: 'string', required: false, example: 'admin' })
    @ApiOkResponse({ description: 'Permissions found' })
    @ApiNotFoundResponse({ description: 'Permissions not found' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions(
        'admin.access.permissions.read',
        'admin.access.permissions.create',
        'admin.access.permissions.update',
        'admin.access.roles.create',
        'admin.access.roles.update'
    )
    @Get()
    public getPermissions(
        @PaginationParams() pagination: PaginationRequest,
    ): Promise<PaginationResponse<PermissionResponseDto>> {
        return this.permissionsService.getPermissions(pagination);
    }

    @ApiOperation({ description: 'Get permission by id' })
    @ApiOkResponse({ description: 'Permission found' })
    @ApiNotFoundResponse({ description: 'Permission not found' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Permissions(
        'admin.access.permissions.read',
        'admin.access.permissions.create',
        'admin.access.permissions.update',
        'admin.access.roles.create',
        'admin.access.roles.update'
    )
    @Get('/:id')
    public getPermissionById(@Param('id', ParseIntPipe) id: number): Promise<PermissionResponseDto> {
        return this.permissionsService.getPermissionById(id);
    }

    @ApiOperation({ description: 'Create new permission' })
    @ApiOkResponse({ description: 'Permission created' })
    @ApiConflictResponse({ description: 'Permission already exists' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @UseGuards(SuperUserGuard)
    @Permissions('admin.access.permissions.create')
    @Post()
    public createPermission(
        @Body(ValidationPipe) permissionDto: CreatePermissionRequestDto,
    ): Promise<PermissionResponseDto> {
        return this.permissionsService.createPermission(permissionDto);
    }

    @ApiOperation({ description: 'Update permission by id' })
    @ApiOkResponse({ description: 'Permission updated' })
    @ApiNotFoundResponse({ description: 'Permission not found' })
    @ApiConflictResponse({ description: 'Permission already exists' })
    @ApiForbiddenResponse({ description: 'Access denied' })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @UseGuards(SuperUserGuard)
    @Permissions('admin.access.permissions.update')
    @Put('/:id')
    public updatePermission(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) permissionDto: UpdatePermissionRequestDto,
    ): Promise<PermissionResponseDto> {
        return this.permissionsService.updatePermission(id, permissionDto)
    };
}
