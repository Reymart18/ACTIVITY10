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

  async createEvent(data: Partial<Event>) {
    return this.eventsRepo.save(this.eventsRepo.create(data));
  }

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
      throw new BadRequestException('Already registered');
    }

    const ticket = this.ticketRepo.create({
      user,
      event,
      referenceCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      checkedIn: false,
    });

    return this.ticketRepo.save(ticket);
  }

  async cancelRegistration(eventId: number, user: User) {
    const ticket = await this.ticketRepo.findOne({
      where: {
        event: { id: eventId },
        user: { id: user.id },
      },
    });

    if (!ticket) {
      throw new BadRequestException('Not registered');
    }

    if (ticket.checkedIn) {
      throw new BadRequestException('Already checked in');
    }

    return this.ticketRepo.remove(ticket);
  }

  async deleteEvent(eventId: number, user: User) {
    const event = await this.eventsRepo.findOne({ where: { id: eventId } });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    if (event.organizerId !== user.id && user.role !== 'admin') {
      throw new BadRequestException('Not authorized to delete this event');
    }

    await this.ticketRepo.delete({ event: { id: eventId } });
    await this.eventsRepo.delete(eventId);

    return { message: 'Event deleted successfully' };
  }

  // ✅ Export attendees as CSV or PDF
  async exportAttendees(eventId: number, type: string): Promise<Buffer> {
    const tickets = await this.ticketRepo.find({
      where: { event: { id: eventId } },
      relations: ['user'],
    });

    if (type === 'csv') {
      const header = 'Name,Email,CheckedIn\n';
      const rows = tickets
        .map(
          (t) =>
            `${t.user?.name ?? '—'},${t.user?.email ?? '—'},${
              t.checkedIn ? 'Yes' : 'No'
            }`,
        )
        .join('\n');

      return Buffer.from(header + rows);
    } else if (type === 'pdf') {
      // Using pdfkit
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();
      const chunks: any[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {});

      doc.fontSize(16).text('Attendees List', { align: 'center' });
      doc.moveDown();

      tickets.forEach((t) => {
        doc.fontSize(12).text(
          `${t.user?.name ?? '—'} | ${t.user?.email ?? '—'} | ${
            t.checkedIn ? 'Yes' : 'No'
          }`,
        );
      });

      doc.end();
      return Buffer.concat(chunks);
    }

    throw new BadRequestException('Invalid export type');
  }
}
