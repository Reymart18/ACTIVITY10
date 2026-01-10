import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>, // <-- injected correctly
  ) {}

  async verify(referenceCode: string) {
    const ticket = await this.ticketRepo.findOne({
      where: { referenceCode },
      relations: ['event', 'user'],
    });

    if (!ticket) return { success: false, message: 'Ticket not found' };
    if (ticket.checkedIn) return { success: false, message: 'Already checked in' };

    ticket.checkedIn = true;
    await this.ticketRepo.save(ticket);

    return { success: true, message: `Checked in: ${ticket.user.name}` };
  }
}
