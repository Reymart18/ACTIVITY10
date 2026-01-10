import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendeesService } from './attendees.service';

@Controller('attendees')
@UseGuards(AuthGuard('jwt'))
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get(':eventId')
  getByEvent(@Param('eventId') eventId: number) {
    return this.attendeesService.findByEvent(eventId);
  }

  @Get(':eventId/search')
  search(
    @Param('eventId') eventId: number,
    @Query('q') query: string
  ) {
    return this.attendeesService.search(eventId, query);
  }
}
