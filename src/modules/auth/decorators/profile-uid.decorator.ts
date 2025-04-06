import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode as jwtDecode } from 'jsonwebtoken';

import { extractAuthTokenFromHeader } from '../../../shared/functions/extract-auth-token-from-header';
import { PayloadSessionInterface } from '../interfaces/general/payload-session.interface';
import { AppHttpException } from '../../../shared/utils/AppHttpException';

export const ProfileUidDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader: unknown = request.headers?.['authorization'];
    if (typeof authHeader !== 'string') {
      throw new AppHttpException(
        'Пользователь не найден.',
        'Пользователь не найден.',
      );
    }

    const token = extractAuthTokenFromHeader(authHeader);
    if (token === null) {
      throw new AppHttpException(
        'Пользователь не найден.',
        'Пользователь не найден.',
      );
    }

    const payload: PayloadSessionInterface = jwtDecode(
      token,
    ) as PayloadSessionInterface;

    if (!payload) {
      throw new AppHttpException(
        'Пользователь не найден.',
        'Пользователь не найден.',
      );
    }

    return payload.profileUid ?? null;
  },
);
