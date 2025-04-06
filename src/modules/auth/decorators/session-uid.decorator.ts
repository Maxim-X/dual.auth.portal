import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode as jwtDecode } from 'jsonwebtoken';

import { extractAuthTokenFromHeader } from '../../../shared/functions/extract-auth-token-from-header';
import { PayloadSessionInterface } from '../interfaces/general/payload-session.interface';
import { AppHttpException } from '../../../shared/utils/AppHttpException';
import { RoleEnum } from '../enum/role.enum';

export const SessionUidDecorator = createParamDecorator(
  (role: RoleEnum, context: ExecutionContext): string => {
    if (!role || !Object.values(RoleEnum).includes(role)) {
      throw new AppHttpException(
        'Недопустимая роль.',
        'Необходимо указать корректную роль пользователя.',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader: unknown =
      role === RoleEnum.ADMIN
        ? request.headers?.['authorization-admin']
        : request.headers?.['authorization'];
    if (typeof authHeader !== 'string') {
      throw new AppHttpException(
        'Пользователь не найден.',
        'Пользователь не найден.',
      );
    }

    const token = extractAuthTokenFromHeader(authHeader);
    if (token === null) {
      throw new AppHttpException('Сессия не найдена.', 'Сессия не найдена.');
    }

    const payload: PayloadSessionInterface = jwtDecode(
      token,
    ) as PayloadSessionInterface;

    if (!payload) {
      throw new AppHttpException('Сессия не найдена.', 'Сессия не найдена.');
    }

    return payload.sessionUid ?? null;
  },
);
