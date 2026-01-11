import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeesService } from './attendees.service';
import { AttendeesController } from './attendees.controller';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, User])],
  providers: [AttendeesService],
  controllers: [AttendeesController],
})
export class AttendeesModule {}
