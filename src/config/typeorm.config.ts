import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Setup default connection in the application
 * @param config {ConfigService}
 */
export const defaultConnection = (config: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: config.get('TYPEORM_HOST'),
    port: config.get('TYPEORM_PORT'),
    username: config.get('TYPEORM_USERNAME'),
    password: config.get('TYPEORM_PASSWORD'),
    database: config.get('TYPEORM_DATABASE'),
    autoLoadEntities: config.get('TYPEORM_AUTOLOAD'),
    synchronize: config.get('TYPEORM_SYNCRONIZE') == 'true',
    logging: config.get('TYPEORM_LOGGING') == 'true'
});