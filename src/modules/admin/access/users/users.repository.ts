import { PaginationRequest } from '@common/pagination';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {

    /**
     * Get users list
     * @param pagination {PaginationRequest}
     * @returns {userEntities: UserEntity[], totalUsers: number}
     */
    public async getUsersAndCount(
        pagination: PaginationRequest
    ): Promise<{ userEntities: UserEntity[], totalUsers: number }> {

        const { skip, limit: take, order, params: { search } } = pagination;
        const query = this.createQueryBuilder('u')
            .innerJoinAndSelect('u.roles', 'r')
            .leftJoinAndSelect('u.permissions', 'p')
            .skip(skip)
            .take(take)
            .orderBy(order);

        if (search) {
            query.where(`
            u.username ILIKE :search
            OR u.first_name ILIKE :search
            OR u.last_name ILIKE :search
            `, { search: `%${search}%` }
            );
        }

        const users = await query.getManyAndCount();

        return {
            userEntities: users[0],
            totalUsers: users[1]
        };
    }
}