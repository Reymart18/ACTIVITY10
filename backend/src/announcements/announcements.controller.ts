// src/announcements/announcements.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req, ForbiddenException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Announcement } from './announcement.entity';

@ApiTags('announcements')
@Controller('announcements')
@UseGuards(AuthGuard('jwt')) // only authenticated users
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all announcements', description: 'Retrieve all announcements' })
  @ApiResponse({ status: 200, description: 'List of announcements retrieved successfully', type: [Announcement] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll() {
    return this.announcementsService.findAll();
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create announcement', description: 'Organizer only: Create a new announcement with optional image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAnnouncementDto })
  @ApiResponse({ status: 201, description: 'Announcement created successfully', type: Announcement })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized (Organizer only)' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/announcements',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `announcement-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() body: { title: string; message: string; eventId?: string },
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    if (req.user.role !== 'organizer') {
      throw new ForbiddenException('Only organizers can create announcements');
    }

    const eventId = body.eventId ? Number(body.eventId) : undefined;
    
    return this.announcementsService.create({
      title: body.title,
      message: body.message,
      eventId,
      image: file?.filename,
    });
  }
}
