import { Module } from '@nestjs/common';
import { AdminAuthController } from './controllers/admin-auth/admin-auth.controller';
import { UserAuthController } from './controllers/user-auth/user-auth.controller';
import { UserAuthService } from './services/user-auth/user-auth.service';
import { GeneralAuthService } from './services/general-auth/general-auth.service';
import { UserEntity } from '../../database/entities/user.entity';
import { AdminEntity } from '../../database/entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from '../../database/entities/session.entity';
import { AdminAuthService } from './services/admin-auth/admin-auth.service';
import { ConfigModule } from '@nestjs/config';
import { GeneralAuthController } from './controllers/general-auth/general-auth.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, AdminEntity, SessionEntity]),
  ],
  controllers: [AdminAuthController, UserAuthController, GeneralAuthController],
  providers: [UserAuthService, GeneralAuthService, AdminAuthService],
})
export class AuthModule {}
