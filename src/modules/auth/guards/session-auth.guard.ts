import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppHttpException } from '../../../shared/utils/AppHttpException';
import { verify as jwtVerify } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { SessionEntity } from 'src/database/entities/session.entity';
import * as moment from 'moment-timezone';

export interface JwtPayload {
  sessionUid: string;
  profileUid: string;
  role: string;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (token === null) {
      throw new AppHttpException(
        'Отсутствует JWT-токен в заголовке Authorization',
        'Срок действия токена истек. Пожалуйста, выполните вход в систему заново.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwtSecret: string | undefined =
      this.configService.get<string>('JWT_SECRET');

    if (jwtSecret === undefined) {
      throw new AppHttpException(
        'Недопустимый JWT_SECRET.',
        'Возникла техническая неполадка. Пожалуйста, повторите попытку. Если ошибка повторится — свяжитесь с нашей службой поддержки!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let payload: JwtPayload;
    try {
      payload = jwtVerify(token, jwtSecret) as JwtPayload;
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

  private extractTokenFromHeader(request: Request): string | null {
    const authorizationHeader: string | undefined = request.headers?.[
      'Authorization'
    ] as string | undefined;

    if (typeof authorizationHeader !== 'string') {
      return null;
    }

    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2) {
      return null; // Неверный формат заголовка
    }

    const token = tokenParts[1];
    return token ?? null;
  }
}
