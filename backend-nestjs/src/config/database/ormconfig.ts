import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

import * as dotenv from 'dotenv';
dotenv.config();

const ormconfig = {
  name: 'default',

  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,

  logging: process.env.DB_LOGGING == 'true',
  dropSchema: false,
  synchronize: false,

  entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],

  migrationsRun: process.env.DB_RUN_MIGRATIONS == 'true',
  migrations: [join(__dirname, '..', '**', 'database/migrations/*.{ts,js}')],
  cli: {
    migrationsDir: './src/config/database/migrations',
  },
} as TypeOrmModuleOptions;

export = ormconfig;
