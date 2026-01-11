import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
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

  // MySQL datetime column
  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column()
  organizerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[];
}
