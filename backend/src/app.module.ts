import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { Event } from './events/event.entity'; // <-- import Event
import { Ticket } from './tickets/ticket.entity'; // <-- import Ticket
import { EventsModule } from './events/events.module';
import { CheckinModule } from './checkin/checkin.module';
import { AttendeesModule } from './attendees/attendees.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',          
      password: '',              
      database: 'activity10_db',
      entities: [User, Event, Ticket], 
      synchronize: true,
    }),
    AuthModule,
    EventsModule,
    CheckinModule,
    AttendeesModule,
    TicketsModule,
  ],
})
export class AppModule {}
