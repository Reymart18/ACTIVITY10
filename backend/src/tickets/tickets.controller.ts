import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get('my-tickets')
  getMyTickets(@Req() req) {
    return this.ticketsService.findByUser(req.user.id);
  }
}
