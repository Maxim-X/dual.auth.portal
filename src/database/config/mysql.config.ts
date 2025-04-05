import { registerAs } from '@nestjs/config';
export default registerAs('database-config', () => {
  return {
    type: process.env.DB_TYPE as string,
    logging: false,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    entities: [`${__dirname}/../entities/*.entity.ts`],
    migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
    cache: false,
  };
});
