// src/announcements/announcements.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { Announcement } from './announcement.entity';
import { Ticket } from '../tickets/ticket.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement, Ticket])],
  providers: [AnnouncementsService, MailService],
  controllers: [AnnouncementsController],
})
export class AnnouncementsModule {}
