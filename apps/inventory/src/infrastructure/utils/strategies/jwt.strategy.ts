import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';

/**
 * EStrategia para el uso de JWT
 *
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'll4v3',
    });
  }

  /**
   * Valida si se puede generar token
   *
   * @param {{ id: string }} payload Valor
   * @return {Promise<string>} Token
   * @memberof JwtStrategy
   */
  async validate(payload: { id: string }): Promise<string> {
    const ids = [
      'e078c32c-6133-4dae-a7d8-cf637c4e6af2',
      '48a0c36c-ec4a-41ca-b36a-af4bbf6fbcd0',
      '04c5b34b-de7e-495f-b00e-7dcb37025df6',
      '0461ad17-37b0-4d17-9130-485d30ed731e',
    ];
    const { id } = payload;
    const exist = ids.find((currentId) => currentId === id);
    if (exist) {
      return exist;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
