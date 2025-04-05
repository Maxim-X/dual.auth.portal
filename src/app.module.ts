import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfiguration from './database/config/mysql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './database/entities/session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfiguration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('database-config')),
        timeout: 30000,
      }),
    }),
    TypeOrmModule.forFeature([SessionEntity]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
