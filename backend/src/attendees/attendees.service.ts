import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  // Fetch attendees for an event
  async findByEvent(eventId: number) {
    const tickets = await this.ticketRepo.find({
      where: { eventId },
      order: { id: 'ASC' },
    });

    // Map to API-friendly format
    return tickets.map(t => ({
      id: t.id,
      name: t.user?.name || '—',
      email: t.user?.email || '—',
      checkedIn: t.checkedIn,
    }));
  }
}
