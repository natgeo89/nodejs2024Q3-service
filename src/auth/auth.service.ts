import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, pass: string) {
    const user = await this.userService.create({
      login: username,
      password: pass,
    });

    return { id: user.id };
  }

  async signIn(username: string, pass: string) {
    const user = await this.userService.findOneByName(username);

    const isPasswordMatches = await bcrypt.compare(pass, user.password);

    if (!isPasswordMatches) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
