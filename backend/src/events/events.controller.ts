import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express'; // ✅ use 'import type'
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

  @Delete(':id/cancel')
  cancelRegistration(@Param('id') id: string, @Req() req) {
    return this.eventsService.cancelRegistration(Number(id), req.user);
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: string, @Req() req) {
    return this.eventsService.deleteEvent(Number(id), req.user);
  }

  // ✅ Export attendees as CSV or PDF
  @Get(':id/export')
  async exportAttendees(
    @Param('id') eventId: string,
    @Query('type') type: string,
    @Res({ passthrough: true }) res: Response, // ✅ passthrough
  ): Promise<Buffer | { message: string }> {
    const file = await this.eventsService.exportAttendees(Number(eventId), type);
  
    if (type === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="event_${eventId}_attendees.csv"`,
      );
    } else if (type === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="event_${eventId}_attendees.pdf"`,
      );
    } else {
      return { message: 'Invalid export type' };
    }
  
    // ✅ Return the file buffer, NestJS will send it automatically
    return file;
  }
  


}
