import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class Event {
  @ApiProperty({ example: 1, description: 'The unique identifier of the event' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tech Conference 2026', description: 'The title of the event' })
  @Column()
  title: string;

  @ApiProperty({ 
    example: 'An exciting technology conference featuring the latest innovations', 
    description: 'Detailed description of the event' 
  })
  @Column()
  description: string;

  @ApiProperty({ example: 'Grand Convention Center, New York', description: 'The location where the event takes place' })
  @Column()
  location: string;

  @ApiProperty({ example: '2026-03-15T09:00:00.000Z', description: 'The start date and time of the event' })
  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @ApiProperty({ example: '2026-03-15T18:00:00.000Z', description: 'The end date and time of the event' })
  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  @ApiProperty({ example: 500, description: 'Maximum capacity for standard tickets' })
  @Column({ type: 'int', nullable: true })
  standardCapacity: number;

  @ApiProperty({ example: 100, description: 'Maximum capacity for VIP tickets' })
  @Column({ type: 'int', nullable: true })
  vipCapacity: number;

  @ApiProperty({ example: 'poster-1234567890.jpg', description: 'Filename of the event poster image' })
  @Column({ nullable: true })
  poster: string;

  @ApiProperty({ example: 2, description: 'ID of the organizer who created this event' })
  @Column()
  organizerId: number;

  @ApiProperty({ example: '2026-01-16T10:30:00.000Z', description: 'Timestamp when the event was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => [Ticket], description: 'List of tickets associated with this event' })
  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[];
}
