// tickets.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  // Fetch tickets by user
  async findByUser(userId: number): Promise<Ticket[]> {
    return this.ticketRepo.find({
      where: {
        user: { id: userId }, // ✅ correct syntax for relations
      },
      relations: ['user', 'event'], // include related data
    });
  }
}
