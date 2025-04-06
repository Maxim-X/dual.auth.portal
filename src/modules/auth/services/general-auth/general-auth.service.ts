import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from '../../dto/general/create-session.dto';
import { CreateSessionInterface } from '../../interfaces/general/create-session.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { SessionEntity } from '../../../../database/entities/session.entity';
import * as moment from 'moment-timezone';
import { ConfigService } from '@nestjs/config';
import { sign as jwtSign } from 'jsonwebtoken';
import { AppHttpException } from '../../../../shared/utils/AppHttpException';
import { LogoutDto } from '../../dto/general/logout.dto';
import { AppHttpResponse } from '../../../../shared/utils/AppHttpResponse';
import { RoleEnum } from '../../enum/role.enum';

@Injectable()
export class GeneralAuthService {
  private readonly EXPIRED_SECONDS = 3600;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async createSession(
    createSessionDto: CreateSessionDto,
  ): Promise<CreateSessionInterface> {
    const newSession = new SessionEntity();
    newSession.profile_uid = createSessionDto.profile_uid;
    newSession.role = createSessionDto.role;
    newSession.expired_at = moment()
      .add(this.EXPIRED_SECONDS, 'seconds')
      .toDate();

    const session: SessionEntity =
      await this.sessionRepository.save(newSession);

    const jwtSecret: string | undefined =
      createSessionDto.role === RoleEnum.ADMIN
        ? this.configService.get<string>('JWT_SECRET_ADMIN')
        : this.configService.get<string>('JWT_SECRET');

    if (jwtSecret === undefined) {
      throw new AppHttpException(
        'Invalid JWT_SECRET.',
        'Возникла техническая неполадка. Пожалуйста, повторите попытку. Если ошибка повторится — свяжитесь с нашей службой поддержки!',
      );
    }

    const jwtToken: string = jwtSign(
      {
        sessionUid: session.uid,
        profileUid: createSessionDto.profile_uid,
        role: session.role,
      },
      jwtSecret,
      { expiresIn: this.EXPIRED_SECONDS },
    );

    return { jwtToken };
  }

  public async logout(logoutDto: LogoutDto): Promise<AppHttpResponse<object>> {
    await this.sessionRepository.update(
      {
        uid: Equal(logoutDto.sessionUid),
      },
      { is_force_expired: true },
    );
    return new AppHttpResponse('Ok', 'Ok', {});
  }
}
