import { Column } from 'typeorm';

export abstract class BaseEntity{
  @Column({
    name: 'inserted_at',
    type: 'timestamp',
    default: () => 'now()',
    update: false,
    nullable: false
  })
  insertedAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'now()',
    nullable: false
  })
  updatedAt: Date;
}
