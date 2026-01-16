// src/checkin/checkin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  async verify(referenceCode: string) {
    const ticket = await this.ticketRepo.findOne({
      where: { referenceCode },
      relations: ['event', 'user'],
    });

    if (!ticket) return { success: false, message: 'Ticket not found' };
    if (ticket.checkedIn) return { success: false, message: 'Already checked in' };

    // Check event date validity
    const now = new Date();
    const eventStart = new Date(ticket.event.startDate);
    const eventEnd = ticket.event.endDate ? new Date(ticket.event.endDate) : null;
    
    // Set time to start of day for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
    
    // Check if event is in the future
    if (eventDay > today) {
      const eventDateFormatted = eventStart.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return { 
        success: false, 
        message: `Ticket invalid: This event is scheduled for ${eventDateFormatted} and cannot be used today.`
      };
    }
    
    // Check if event has ended (if endDate exists, use it; otherwise compare to event start date)
    const eventEndDay = eventEnd 
      ? new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate())
      : eventDay;
    
    if (eventEndDay < today) {
      return { 
        success: false, 
        message: 'Ticket expired. Event ended.'
      };
    }

    ticket.checkedIn = true;
    await this.ticketRepo.save(ticket);

    const seatTypeLabel = ticket.seatType === 'vip' ? 'VIP' : 'Standard';
    return { 
      success: true, 
      message: `Checked in: ${ticket.user.name}`,
      name: ticket.user.name,
      seatType: seatTypeLabel
    };
  }

  // ---------------------------
  // Admin: fetch all checked-in tickets
  // ---------------------------
  async getAllCheckins() {
    const tickets = await this.ticketRepo.find({
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' }, // latest first
    });

    return tickets.map(t => ({
      id: t.id,
      userName: t.user.name,
      userEmail: t.user.email,
      eventName: t.event.title,
      checkedIn: t.checkedIn,
      checkinDate: t.checkedIn ? t.updatedAt : null,
    }));
  }
}
