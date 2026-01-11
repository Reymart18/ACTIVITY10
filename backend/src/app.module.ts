// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Auth & User
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

// Event & Ticket
import { Event } from './events/event.entity';
import { Ticket } from './tickets/ticket.entity';

// Modules
import { EventsModule } from './events/events.module';
import { CheckinModule } from './checkin/checkin.module';
import { AttendeesModule } from './attendees/attendees.module';
import { TicketsModule } from './tickets/tickets.module';

// Announcements
import { AnnouncementsModule } from './announcements/announcements.module';
import { Announcement } from './announcements/announcement.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'activity10_db',
      entities: [User, Event, Ticket, Announcement], 
      synchronize: true,
    }),
    AuthModule,
    EventsModule,
    CheckinModule,
    AttendeesModule,
    TicketsModule,
    AnnouncementsModule, 
  ],
})
export class AppModule {}
