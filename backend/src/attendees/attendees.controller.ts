import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendeesService } from './attendees.service';

//@UseGuards(AuthGuard('jwt'))
@Controller('attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get(':eventId')
  getByEvent(@Param('eventId') eventId: number) {
    return this.attendeesService.findByEvent(eventId);
  }
}
