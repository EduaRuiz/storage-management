export interface IJwtPayload {
  sub: number; // Id del usuario
  iat: number; // Fecha de emisión del token
  exp: number; // Fecha de expiración del token
}
