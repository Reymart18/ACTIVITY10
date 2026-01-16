// src/announcements/announcements.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { Ticket } from '../tickets/ticket.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    private readonly mailService: MailService,
  ) {}

  findAll(): Promise<Announcement[]> {
    return this.announcementRepo.find({ 
      order: { createdAt: 'DESC' },
      relations: ['event'],
    });
  }

  async create(data: { title: string; message: string; eventId?: number; image?: string }): Promise<Announcement> {
    const newAnn = this.announcementRepo.create(data);
    const savedAnnouncement = await this.announcementRepo.save(newAnn);

    // If eventId is provided, send emails to all registered users for that event
    if (data.eventId) {
      await this.sendAnnouncementEmails(savedAnnouncement, data.eventId);
    }

    return savedAnnouncement;
  }

  private async sendAnnouncementEmails(announcement: Announcement, eventId: number) {
    try {
      // Get all tickets (registered users) for this event
      const tickets = await this.ticketRepo.find({
        where: { eventId },
        relations: ['user', 'event'],
      });

      // Send email to each registered user
      for (const ticket of tickets) {
        if (ticket.user && ticket.user.email) {
          await this.mailService.sendAnnouncementEmail(
            ticket.user.email,
            ticket.user.name,
            {
              announcementTitle: announcement.title,
              announcementMessage: announcement.message,
              eventTitle: ticket.event.title,
              eventDate: ticket.event.startDate,
            },
          );
        }
      }

      console.log(`Sent announcement emails to ${tickets.length} attendees for event ${eventId}`);
    } catch (error) {
      console.error('Error sending announcement emails:', error);
      // Don't throw error - announcement is already saved
    }
  }
}
