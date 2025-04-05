import { DataSourceOptions, DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const typeormDataSource: DataSourceOptions = {
  type: process.env.DB_TYPE as 'mariadb' | 'mysql',
  logging: false,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${__dirname}/../entities/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  synchronize: false,
  cache: false,
};

const dataSource = new DataSource(typeormDataSource);
export default dataSource;
