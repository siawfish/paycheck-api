import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET_OR_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUserByToken(payload._id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
