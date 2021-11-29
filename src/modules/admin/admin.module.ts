import { Module } from '@nestjs/common';
import { AccessModule } from './access/access.module';

@Module({
  imports: [AccessModule],
})
export class AdminModule {}
