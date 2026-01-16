import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CheckinService } from './checkin.service';
import { CheckinDto } from './dto/checkin.dto';

@ApiTags('checkin')
@Controller('checkin')
@UseGuards(AuthGuard('jwt'))
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  // Check-in a ticket by reference code
  @Post('verify')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check in ticket', description: 'Verify and check in a ticket using its reference code' })
  @ApiBody({ type: CheckinDto })
  @ApiResponse({ status: 200, description: 'Ticket checked in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  verify(@Body('referenceCode') code: string) {
    return this.checkinService.verify(code);
  }

  // Admin: Get all check-ins
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all check-ins', description: 'Admin only: Retrieve all check-in records' })
  @ApiResponse({ status: 200, description: 'List of check-ins retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized (Admin only)' })
  async getAll(@Req() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Not authorized to view attendance.');
    }
    return this.checkinService.getAllCheckins();
  }
}
