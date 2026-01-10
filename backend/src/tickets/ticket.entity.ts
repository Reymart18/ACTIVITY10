// src/tickets/ticket.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';
import { Event } from '../events/event.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  referenceCode: string;

  @Column({ default: false })
  checkedIn: boolean;

  @ManyToOne(() => User, user => user.tickets)
  user: User;

  @ManyToOne(() => Event, event => event.tickets)
  event: Event;
}
