import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Column()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'hashed_password_here', description: 'Hashed password of the user' })
  @Column()
  password: string;

  @ApiProperty({ example: 'attendee', enum: ['attendee', 'organizer', 'admin'], description: 'Role of the user in the system' })
  @Column({ default: 'attendee' })
  role: string; // 'attendee', 'organizer', 'admin'

  @ApiProperty({ example: true, description: 'Whether the user account is active' })
  @Column({ default: true })
  isActive: boolean; // true = active, false = deactivated

  @ApiProperty({ type: () => [Ticket], description: 'List of tickets associated with this user' })
  @OneToMany(() => Ticket, ticket => ticket.user)
  tickets: Ticket[];
}
