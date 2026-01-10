// src/auth/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'attendee' })
  role: string;

  // 🔹 Add this for Ticket relation
  @OneToMany(() => Ticket, ticket => ticket.user)
  tickets: Ticket[];
}
