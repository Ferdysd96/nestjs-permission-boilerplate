import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
  imports: [...databaseProviders],
})
export class DatabaseModule {}
