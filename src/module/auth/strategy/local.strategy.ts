import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      usernameField: 'personalID',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, personalID: string, password: string): Promise<any> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateUser(personalID, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
