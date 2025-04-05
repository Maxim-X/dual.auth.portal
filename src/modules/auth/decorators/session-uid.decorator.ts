import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode as jwtDecode } from 'jsonwebtoken';

import { extractAuthTokenFromHeader } from '../../../shared/functions/extract-auth-token-from-header';
import { PayloadSessionInterface } from '../interfaces/general/payload-session.interface';
import { AppHttpException } from '../../../shared/utils/AppHttpException';

export const SessionUidDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<Request>();

    const token = extractAuthTokenFromHeader(request);
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
