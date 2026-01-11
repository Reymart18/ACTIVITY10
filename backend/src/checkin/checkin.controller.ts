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
import { CheckinService } from './checkin.service';

@Controller('checkin')
@UseGuards(AuthGuard('jwt'))
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  // Check-in a ticket by reference code
  @Post('verify')
  verify(@Body('referenceCode') code: string) {
    return this.checkinService.verify(code);
  }

  // Admin: Get all check-ins
  @Get()
  async getAll(@Req() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Not authorized to view attendance.');
    }
    return this.checkinService.getAllCheckins();
  }
}
