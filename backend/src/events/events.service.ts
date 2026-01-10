// src/events/events.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  // Fetch all events with registered count
  async findAllEvents(): Promise<any[]> {
    const events = await this.eventsRepo.find({ relations: ['tickets'] });
    return events.map(e => ({
      ...e,
      registered: e.tickets.length,
    }));
  }

  // Fetch events for a specific organizer
  async findByOrganizer(organizerId: number) {
    return this.eventsRepo.find({
      where: { organizerId },
      relations: ['tickets'],
      order: { createdAt: 'DESC' },
    });
  }

  // Create new event
  async createEvent(eventData: Partial<Event>) {
    const event = this.eventsRepo.create(eventData);
    return this.eventsRepo.save(event);
  }

  // Register attendee to an event
  // src/events/events.service.ts
async registerForEvent(eventId: number, userData: Partial<User>, user?: User) {
    const event = await this.eventsRepo.findOne({
      where: { id: eventId },
      relations: ['tickets'],
    });
  
    if (!event) throw new Error('Event not found');
  
    // Check capacity
    if (event.capacity && event.tickets.length >= event.capacity) {
      throw new Error('Event is full');
    }
  
    // Create ticket and assign to logged-in user
    const ticket = this.ticketRepo.create({
      event,
      user, // link user
      referenceCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });
  
    return this.ticketRepo.save(ticket);
  }
}
