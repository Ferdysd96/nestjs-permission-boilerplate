import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth/auth.module';
import { RoleEntity } from './role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleEntity]),
        AuthModule
    ],
    controllers: [RolesController],
    providers: [RolesService],
})
export class RolesModule { }
