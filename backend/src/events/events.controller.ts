import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAllEvents(@Req() req) {
    return this.eventsService.findAllEvents(req.user.id);
  }

  @Get('my-events')
  getMyEvents(@Req() req) {
    return this.eventsService.findByOrganizer(req.user.id);
  }

  @Post()
  createEvent(@Body() data, @Req() req) {
    data.organizerId = req.user.id;
    return this.eventsService.createEvent(data);
  }

  @Post(':id/register')
  register(@Param('id') id: string, @Req() req) {
    return this.eventsService.registerForEvent(Number(id), req.user);
  }

  // ✅ Cancel registration
  @Delete(':id/cancel')
  cancelRegistration(@Param('id') id: string, @Req() req) {
    return this.eventsService.cancelRegistration(Number(id), req.user);
  }
}
