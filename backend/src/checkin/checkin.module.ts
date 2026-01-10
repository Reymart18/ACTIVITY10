import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { Ticket } from '../tickets/ticket.entity'; // import Ticket entity

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])], // <-- add this
  providers: [CheckinService],
  controllers: [CheckinController],
})
export class CheckinModule {}
