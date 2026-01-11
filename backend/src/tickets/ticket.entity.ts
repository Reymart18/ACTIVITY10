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
import { User } from '../auth/user.entity';
import { Event } from '../events/event.entity';

@Entity()
@Unique(['userId', 'eventId']) // 🔒 ONE TICKET PER USER PER EVENT
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  referenceCode: string;

  @Column({ default: false })
  checkedIn: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.tickets, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  eventId: number;

  @ManyToOne(() => Event, event => event.tickets)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  // ---------------------------
  // Timestamps
  // ---------------------------
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
