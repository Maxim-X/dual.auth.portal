export function extractAuthTokenFromHeader(request: Request): string | null {
  const authorizationHeader: string | undefined = request.headers?.[
    'authorization'
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
