import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSessionDto } from '../../dto/general/create-session.dto';
import { CreateSessionInterface } from '../../interfaces/general/create-session.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../../../../database/entities/session.entity';
import * as moment from 'moment-timezone';
import { ConfigService } from '@nestjs/config';
import { sign as jwtSign } from 'jsonwebtoken';
import { AppHttpException } from '../../../../shared/utils/AppHttpException';

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
      this.configService.get<string>('JWT_SECRET');
    if (jwtSecret === undefined) {
      throw new AppHttpException(
        'Invalid JWT_SECRET',
        'Возникла техническая неполадка. Пожалуйста, повторите попытку. Если ошибка повторится — свяжитесь с нашей службой поддержки!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwtToken: string = jwtSign(
      {
        sessionUid: session.uid,
        role: session.role,
      },
      jwtSecret,
      { expiresIn: this.EXPIRED_SECONDS },
    );

    return { jwtToken };
  }
}
