// src/events/events.controller.ts
import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Event } from './event.entity';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAllEvents(): Promise<Event[]> {
    return this.eventsService.findAllEvents();
  }

  @Get('my-events')
  getMyEvents(@Req() req) {
    return this.eventsService.findByOrganizer(req.user.id);
  }

  @Post()
  createEvent(@Body() data: Partial<Event>, @Req() req) {
    data.organizerId = req.user.id;
    return this.eventsService.createEvent(data);
  }

    // src/events/events.controller.ts

@Post(':id/register')
async register(
  @Param('id') id: string,   // change from number -> string
  @Body() body: any,
  @Req() req
) {
  return this.eventsService.registerForEvent(Number(id), body, req.user); // convert to number
}
}
