import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string; role: 'attendee' | 'organizer' },
  ) {
    const { name, email, password, role } = body;
    return this.authService.register(name, email, password, role);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);
    if (!result) throw new UnauthorizedException('Invalid credentials');

    return { user: result.user, token: result.token };
  }
}
