// src/announcements/announcements.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
@UseGuards(AuthGuard('jwt')) // only authenticated users
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  getAll() {
    return this.announcementsService.findAll();
  }

  @Post()
  async create(@Body() body: { title: string; message: string }, @Req() req) {
    if (req.user.role !== 'organizer') {
      throw new ForbiddenException('Only organizers can create announcements');
    }
    return this.announcementsService.create(body);
  }
}
