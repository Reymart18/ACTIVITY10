// src/announcements/announcements.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
  ) {}

  findAll(): Promise<Announcement[]> {
    return this.announcementRepo.find({ order: { createdAt: 'DESC' } });
  }

  create(data: { title: string; message: string }): Promise<Announcement> {
    const newAnn = this.announcementRepo.create(data);
    return this.announcementRepo.save(newAnn);
  }
}
