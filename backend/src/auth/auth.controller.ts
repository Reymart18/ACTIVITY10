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
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto, RegisterOrganizerDto, LoginDto } from './dto/register.dto';
import { User } from './user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ---------------------------
  // Public registration (Attendee)
  // ---------------------------
  @Post('register')
  @ApiOperation({ summary: 'Register attendee', description: 'Register a new attendee account (public endpoint)' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Attendee registered successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Cannot register as organizer' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register organizer', description: 'Admin only: Register a new organizer account' })
  @ApiBody({ type: RegisterOrganizerDto })
  @ApiResponse({ status: 201, description: 'Organizer registered successfully', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized to create organizers (Admin only)' })
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
  @ApiOperation({ summary: 'Login', description: 'Login with email and password to receive JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object', description: 'User information' },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all organizers', description: 'Admin only: Retrieve list of all organizers' })
  @ApiResponse({ status: 200, description: 'List of organizers retrieved successfully', type: [User] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized (Admin only)' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deactivate organizer', description: 'Admin only: Deactivate an organizer account' })
  @ApiResponse({ status: 200, description: 'Organizer deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized (Admin only)' })
  async deactivateOrganizer(@Req() req, @Param('id') id: number) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Not authorized');
    return this.authService.setOrganizerStatus(id, false);
  }

  // ---------------------------
  // Admin: Activate organizer
  // ---------------------------
  @UseGuards(JwtAuthGuard)
  @Patch('organizer/:id/activate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Activate organizer', description: 'Admin only: Activate an organizer account' })
  @ApiResponse({ status: 200, description: 'Organizer activated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized (Admin only)' })
  async activateOrganizer(@Req() req, @Param('id') id: number) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Not authorized');
    return this.authService.setOrganizerStatus(id, true);
  }

  // ---------------------------
  // Admin: Delete organizer
  // ---------------------------
  @UseGuards(JwtAuthGuard)
  @Delete('organizer/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete organizer', description: 'Admin only: Delete an organizer account' })
  @ApiResponse({ status: 200, description: 'Organizer deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized (Admin only)' })
  async deleteOrganizer(@Req() req, @Param('id') id: number) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Not authorized');
    return this.authService.deleteOrganizer(id);
  }
}
