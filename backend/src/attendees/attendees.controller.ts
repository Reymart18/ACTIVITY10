import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AttendeesService } from './attendees.service';

//@UseGuards(AuthGuard('jwt'))
@ApiTags('attendees')
@Controller('attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get(':eventId')
  @ApiOperation({ summary: 'Get attendees by event', description: 'Retrieve all attendees for a specific event' })
  @ApiParam({ name: 'eventId', example: 1, description: 'ID of the event' })
  @ApiResponse({ status: 200, description: 'List of attendees retrieved successfully' })
  getByEvent(@Param('eventId') eventId: number) {
    return this.attendeesService.findByEvent(eventId);
  }
}
