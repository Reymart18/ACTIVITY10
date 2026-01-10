// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { User } from '../auth/user.entity';
import { Ticket } from '../tickets/ticket.entity';  // <- add this

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, Ticket])], // <- include Ticket here
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
