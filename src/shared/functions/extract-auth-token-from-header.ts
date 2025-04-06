export function extractAuthTokenFromHeader(
  authorizationHeader: string,
): string | null {
  const tokenParts = authorizationHeader.split(' ');
  if (tokenParts.length !== 2) {
    return null; // Неверный формат заголовка
  }

  const token = tokenParts[1];
  return token ?? null;
}
