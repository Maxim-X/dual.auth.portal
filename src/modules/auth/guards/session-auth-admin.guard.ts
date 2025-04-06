import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppHttpException } from '../../../shared/utils/AppHttpException';
import { verify as jwtVerify } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { extractAuthTokenFromHeader } from '../../../shared/functions/extract-auth-token-from-header';
import { PayloadSessionInterface } from '../interfaces/general/payload-session.interface';
import { SessionEntity } from '../../../database/entities/session.entity';
import { RoleEnum } from '../enum/role.enum';

@Injectable()
export class SessionAuthAdminGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader: unknown = request.headers?.['authorization-admin'];
    if (typeof authHeader !== 'string') {
      throw new AppHttpException(
        'Отсутствует JWT-токен в заголовке',
        'Срок действия токена истек. Пожалуйста, выполните вход в систему заново.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = extractAuthTokenFromHeader(authHeader);

    if (token === null) {
      throw new AppHttpException(
        'Отсутствует JWT-токен в заголовке',
        'Срок действия токена истек. Пожалуйста, выполните вход в систему заново.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwtSecret: string | undefined =
      this.configService.get<string>('JWT_SECRET_ADMIN');

    if (jwtSecret === undefined) {
      throw new AppHttpException(
        'Недопустимый JWT_SECRET.',
        'Возникла техническая неполадка. Пожалуйста, повторите попытку. Если ошибка повторится — свяжитесь с нашей службой поддержки!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let payload: PayloadSessionInterface;
    try {
      payload = jwtVerify(token, jwtSecret) as PayloadSessionInterface;
    } catch (error) {
      console.error('Ошибка проверки JWT:', error);
      throw new AppHttpException(
        'Ошибка проверки JWT.',
        'Срок действия токена истек. Пожалуйста, выполните вход в систему заново.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const session: SessionEntity | null = await this.sessionRepository.findOne({
      where: {
        uid: Equal(payload.sessionUid),
        role: Equal(RoleEnum.ADMIN),
      },
    });

    if (session === null || session?.is_force_expired) {
      throw new AppHttpException(
        'Срок действия токена истек. Пожалуйста, выполните вход в систему заново.',
        'Срок действия токена истек. Пожалуйста, выполните вход в систему заново.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (moment().isAfter(moment(session.expired_at))) {
      throw new AppHttpException(
        'Срок действия токена истек. Пожалуйста, выполните вход в систему заново.',
        'Срок действия токена истек. Пожалуйста, выполните вход в систему заново.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
