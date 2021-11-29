import { BaseEntity } from '@database/entities';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { PermissionEntity } from '../permissions/permission.entity';

@Entity({ schema: 'admin', name: 'roles' })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 50,
  })
  name: string;

  @Column({
    name: 'active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  active: boolean;

  @ManyToMany((type) => PermissionEntity, (permission) => permission.id, {
    lazy: true,
    cascade: true,
  })
  @JoinTable({
    schema: 'admin',
    name: 'roles_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Promise<PermissionEntity[]>;

  constructor(role?: Partial<RoleEntity>) {
    super();
    Object.assign(this, role);
  }
}
