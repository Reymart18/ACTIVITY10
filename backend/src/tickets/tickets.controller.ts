import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Ticket } from './ticket.entity';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get('my-tickets')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my tickets', description: 'Retrieve all tickets for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user tickets retrieved successfully', type: [Ticket] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyTickets(@Req() req) {
    return this.ticketsService.findByUser(req.user.id);
  }
}
