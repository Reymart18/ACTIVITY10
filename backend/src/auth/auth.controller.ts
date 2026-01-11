import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  UnauthorizedException,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ---------------------------
  // Public registration (Attendee)
  // ---------------------------
  @Post('register')
  async registerAttendee(
    @Body() body: { name: string; email: string; password: string; role?: string },
  ) {
    if (body.role && body.role !== 'attendee') {
      throw new ForbiddenException(
        'Cannot register as organizer. Only admin can create organizers.',
      );
    }

    return this.authService.register(body.name, body.email, body.password, 'attendee');
  }

  // ---------------------------
  // Admin-only registration (Organizer)
  // ---------------------------
  @UseGuards(JwtAuthGuard)
  @Post('register-organizer')
  async registerOrganizer(
    @Req() req,
    @Body() body: { name: string; email: string; password: string },
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Not authorized to create organizers.');
    }

    return this.authService.register(body.name, body.email, body.password, 'organizer');
  }

  // ---------------------------
  // Login
  // ---------------------------
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);

    if (!result) throw new UnauthorizedException('Invalid credentials');
    if ((result as any).error) throw new UnauthorizedException((result as any).error);

    return { user: result.user, token: result.token };
  }

  // ---------------------------
  // Admin: Get all organizers
  // ---------------------------
  @UseGuards(JwtAuthGuard)
  @Get('organizers')
  async getOrganizers(@Req() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Not authorized to view organizers.');
    }

    return this.authService.getOrganizers();
  }

  // ---------------------------
  // Admin: Deactivate organizer
  // ---------------------------
  @UseGuards(JwtAuthGuard)
  @Patch('organizer/:id/deactivate')
  async deactivateOrganizer(@Req() req, @Param('id') id: number) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Not authorized');
    return this.authService.setOrganizerStatus(id, false);
  }

  // ---------------------------
  // Admin: Activate organizer
  // ---------------------------
  @UseGuards(JwtAuthGuard)
  @Patch('organizer/:id/activate')
  async activateOrganizer(@Req() req, @Param('id') id: number) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Not authorized');
    return this.authService.setOrganizerStatus(id, true);
  }
}
