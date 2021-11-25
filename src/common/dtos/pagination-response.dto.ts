import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({ example: 1 })
  currentPage: number;
  @ApiProperty({ example: 0 })
  skippedRecords: number;
  @ApiProperty({ example: 2 })
  totalPages: number;
  @ApiProperty({ example: true })
  hasNext: boolean;
  @ApiProperty()
  content: T[];
  @ApiProperty({ example: 5 })
  payloadSize: number;
  @ApiProperty({ example: 9 })
  totalRecords: number;
}
