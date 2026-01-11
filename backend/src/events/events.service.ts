import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepo: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // 🔹 ALL EVENTS (ATTENDEE VIEW)
  async findAllEvents(userId: number) {
    const events = await this.eventsRepo.find({
      relations: ['tickets', 'tickets.user'],
    });

    return events.map(e => {
      const registered = e.tickets.some(t => t.user?.id === userId);
      return {
        id: e.id,
        title: e.title,
        description: e.description, 
        location: e.location,
        startDate: e.startDate,
        capacity: e.capacity,
        tickets: e.tickets,
        ticketsCount: e.tickets.length,
        isRegistered: registered,
      };
    });
  }

  // 🔹 ORGANIZER VIEW
  async findByOrganizer(organizerId: number) {
    const events = await this.eventsRepo.find({
      where: { organizerId },
      relations: ['tickets', 'tickets.user'],
      order: { createdAt: 'DESC' },
    });

    return events.map(e => ({
      ...e,
      attendees: e.tickets.map(t => ({
        id: t.id,
        name: t.user?.name ?? '—',
        email: t.user?.email ?? '—',
        checkedIn: t.checkedIn,
      })),
    }));
  }

  // 🔹 CREATE EVENT
  async createEvent(data: Partial<Event>) {
    return this.eventsRepo.save(this.eventsRepo.create(data));
  }

  // 🔒 REGISTER FOR EVENT
  async registerForEvent(eventId: number, user: User) {
    const event = await this.eventsRepo.findOne({
      where: { id: eventId },
      relations: ['tickets'],
    });

    if (!event) throw new BadRequestException('Event not found');

    if (event.capacity && event.tickets.length >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const existingTicket = await this.ticketRepo.findOne({
      where: {
        user: { id: user.id },
        event: { id: eventId },
      },
    });

    if (existingTicket) {
      throw new BadRequestException(
        'You are already registered for this event',
      );
    }

    const ticket = this.ticketRepo.create({
      user,
      event,
      referenceCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      checkedIn: false,
    });

    return this.ticketRepo.save(ticket);
  }

  // 🔹 CANCEL REGISTRATION (only if not checked in)
  async cancelRegistration(eventId: number, user: User) {
    const ticket = await this.ticketRepo.findOne({
      where: {
        event: { id: eventId },
        user: { id: user.id },
      },
    });

    if (!ticket) {
      throw new BadRequestException('You are not registered for this event');
    }

    if (ticket.checkedIn) {
      throw new BadRequestException('Cannot cancel after check-in');
    }

    return this.ticketRepo.remove(ticket);
  }
}
