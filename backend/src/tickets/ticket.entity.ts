// src/tickets/ticket.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../auth/user.entity';
import { Event } from '../events/event.entity';

@Entity()
@Unique(['userId', 'eventId']) // 🔒 ONE TICKET PER USER PER EVENT
export class Ticket {
  @ApiProperty({ example: 1, description: 'The unique identifier of the ticket' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'TKT-ABC123XYZ', description: 'Unique reference code for the ticket' })
  @Column()
  referenceCode: string;

  @ApiProperty({ example: false, description: 'Whether the ticket has been checked in' })
  @Column({ default: false })
  checkedIn: boolean;

  @ApiProperty({ example: 'standard', enum: ['standard', 'vip'], description: 'Type of seat for the ticket' })
  @Column({ default: 'standard' })
  seatType: string;

  @ApiProperty({ example: 3, description: 'ID of the user who owns this ticket' })
  @Column()
  userId: number;

  @ApiProperty({ type: () => User, description: 'User who owns this ticket' })
  @ManyToOne(() => User, user => user.tickets, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: 1, description: 'ID of the event this ticket is for' })
  @Column()
  eventId: number;

  @ApiProperty({ type: () => Event, description: 'Event this ticket is for' })
  @ManyToOne(() => Event, event => event.tickets)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  // ---------------------------
  // Timestamps
  // ---------------------------
  @ApiProperty({ example: '2026-01-16T10:30:00.000Z', description: 'Timestamp when the ticket was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-01-16T10:30:00.000Z', description: 'Timestamp when the ticket was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
