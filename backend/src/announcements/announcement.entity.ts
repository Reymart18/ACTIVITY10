// src/announcements/announcement.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../events/event.entity';

@Entity()
export class Announcement {
  @ApiProperty({ example: 1, description: 'The unique identifier of the announcement' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Important Update', description: 'Title of the announcement' })
  @Column()
  title: string;

  @ApiProperty({ example: 'The event venue has been changed to the Grand Hall', description: 'Message content of the announcement' })
  @Column('text')
  message: string;

  @ApiProperty({ example: 'announcement-1234567890.jpg', description: 'Filename of the announcement image' })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ example: 1, description: 'ID of the event this announcement is related to' })
  @Column({ nullable: true })
  eventId: number;

  @ApiProperty({ type: () => Event, description: 'Event this announcement is related to' })
  @ManyToOne(() => Event, { nullable: true, eager: true })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ApiProperty({ example: '2026-01-16T10:30:00.000Z', description: 'Timestamp when the announcement was created' })
  @CreateDateColumn()
  createdAt: Date;
}
