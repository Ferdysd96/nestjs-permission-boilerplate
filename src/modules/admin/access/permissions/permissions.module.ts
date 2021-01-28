import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth/auth.module';
import { PermissionEntity } from './permission.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
    AuthModule
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule { }
