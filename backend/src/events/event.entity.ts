// src/events/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column()
  organizerId: number;

  @CreateDateColumn()
  createdAt: Date;

  // 🔹 Add this for the Ticket relation
  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[];
}
