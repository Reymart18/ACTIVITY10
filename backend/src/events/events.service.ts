import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../auth/user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepo: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async findPublicEvents() {
    const events = await this.eventsRepo.find({
      relations: ['tickets'],
      order: { createdAt: 'DESC' },
    });

    return events.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      standardCapacity: e.standardCapacity,
      vipCapacity: e.vipCapacity,
      poster: e.poster,
      tickets: e.tickets,
      ticketsCount: e.tickets.length,
    }));
  }

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
        endDate: e.endDate,
        standardCapacity: e.standardCapacity,
        vipCapacity: e.vipCapacity,
        poster: e.poster,
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
        seatType: t.seatType,
      })),
    }));
  }

  async createEvent(data: Partial<Event>) {
    return this.eventsRepo.save(this.eventsRepo.create(data));
  }

  async updateEvent(eventId: number, data: Partial<Event>, user: User) {
    const event = await this.eventsRepo.findOne({ where: { id: eventId } });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    // Only the organizer who created the event or admin can update it
    if (event.organizerId !== user.id && user.role !== 'admin') {
      throw new BadRequestException('Not authorized to update this event');
    }

    // Update the event with new data
    Object.assign(event, data);
    return this.eventsRepo.save(event);
  }

  async registerForEvent(eventId: number, user: User, seatType: string = 'standard') {
    const event = await this.eventsRepo.findOne({
      where: { id: eventId },
      relations: ['tickets'],
    });

    if (!event) throw new BadRequestException('Event not found');

    // Check seat type capacity
    const seatTypeTickets = event.tickets.filter(t => t.seatType === seatType);
    const capacity = seatType === 'vip' ? event.vipCapacity : event.standardCapacity;
    
    if (capacity && seatTypeTickets.length >= capacity) {
      throw new BadRequestException(`${seatType === 'vip' ? 'VIP' : 'Standard'} seats are full`);
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
      seatType,
      referenceCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      checkedIn: false,
    });

    const savedTicket = await this.ticketRepo.save(ticket);

    // Send email with ticket (non-blocking - fire and forget)
    this.mailService.sendTicketEmail(
      user.email,
      user.name,
      {
        eventTitle: event.title,
        eventLocation: event.location,
        eventDate: event.startDate,
        referenceCode: savedTicket.referenceCode,
        seatType: savedTicket.seatType,
        ticketId: savedTicket.id,
        eventId: event.id,
      },
    ).then(() => {
      console.log(`Ticket email sent to ${user.email}`);
    }).catch((error) => {
      console.error('Failed to send ticket email:', error);
    });

    return savedTicket;
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

    // Check if 5 minutes have passed since registration
    const registrationTime = new Date(ticket.createdAt).getTime();
    const currentTime = new Date().getTime();
    const minutesPassed = (currentTime - registrationTime) / (1000 * 60);

    if (minutesPassed >= 5) {
      throw new BadRequestException('Cancellation period has expired. You can only cancel within 5 minutes of registration.');
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
