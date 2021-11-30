import { PaginationRequest } from '@libs/pagination';
import { EntityRepository, Repository } from 'typeorm';
import { PermissionEntity } from './permission.entity';

@EntityRepository(PermissionEntity)
export class PermissionsRepository extends Repository<PermissionEntity> {
  /**
   * Get permision list
   * @param pagination {PaginationRequest}
   * @returns permissionEntities[] and totalPermissions
   */
  public async getPermissionsAndCount(
    pagination: PaginationRequest,
  ): Promise<[permissionEntities: PermissionEntity[], totalPermissions: number]> {
    const {
      skip,
      limit: take,
      order,
      params: { search },
    } = pagination;
    const query = this.createQueryBuilder().skip(skip).take(take).orderBy(order);

    if (search) {
      query.where('description ILIKE :search', {
        search: `%${search}%`,
      });
    }

    return query.getManyAndCount();
  }
}
