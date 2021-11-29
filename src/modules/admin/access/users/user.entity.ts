import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '@database/entities';
import { PermissionEntity } from '../permissions/permission.entity';
import { RoleEntity } from '../roles/role.entity';
import { UserStatus } from './user-status.enum';

@Entity({ schema: 'admin', name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid', generated: 'uuid' })
  id?: string;

  @Column({
    name: 'username',
    type: 'varchar',
    unique: true,
  })
  username: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    name: 'is_super_user',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isSuperUser: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    nullable: false,
  })
  status: UserStatus;

  @ManyToMany(() => RoleEntity, (role) => role.id, {
    lazy: true,
    cascade: true,
  })
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Promise<RoleEntity[]>;

  @ManyToMany(() => PermissionEntity, (permission) => permission.id, {
    lazy: true,
    cascade: true,
  })
  @JoinTable({
    name: 'users_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Promise<PermissionEntity[]>;

  constructor(user?: Partial<UserEntity>) {
    super();
    Object.assign(this, user);
  }
}
