import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

export const commonFields: TableColumnOptions[] = [
  {
    name: 'inserted_at',
    type: 'timestamp',
    isNullable: false,
    default: 'now()',
  },
  {
    name: 'updated_at',
    type: 'timestamp',
    isNullable: false,
    default: 'now()',
  },
];
