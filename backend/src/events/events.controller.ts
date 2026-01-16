import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Req,
  Delete,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express'; // ✅ use 'import type'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { Event } from './event.entity';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Public endpoint for guests
  @Get('public')
  @ApiOperation({ summary: 'Get all public events', description: 'Retrieve a list of all public events without authentication' })
  @ApiResponse({ status: 200, description: 'List of public events retrieved successfully', type: [Event] })
  getPublicEvents() {
    return this.eventsService.findPublicEvents();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all events', description: 'Retrieve all events for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of events retrieved successfully', type: [Event] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAllEvents(@Req() req) {
    return this.eventsService.findAllEvents(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-events')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my events', description: 'Retrieve all events created by the authenticated organizer' })
  @ApiResponse({ status: 200, description: 'List of organizer events retrieved successfully', type: [Event] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyEvents(@Req() req) {
    return this.eventsService.findByOrganizer(req.user.id);
  }

  // Admin: Get events by specific organizer
  @UseGuards(JwtAuthGuard)
  @Get('organizer/:organizerId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get events by organizer', description: 'Admin only: Retrieve all events created by a specific organizer' })
  @ApiParam({ name: 'organizerId', example: 2, description: 'ID of the organizer' })
  @ApiResponse({ status: 200, description: 'List of organizer events retrieved successfully', type: [Event] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized (Admin only)' })
  getEventsByOrganizer(@Param('organizerId') organizerId: string, @Req() req) {
    // Only admin can view other organizers' events
    if (req.user.role !== 'admin') {
      throw new Error('Not authorized');
    }
    return this.eventsService.findByOrganizer(Number(organizerId));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new event', description: 'Create a new event with poster image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created successfully', type: Event })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `poster-${uniqueSuffix}${ext}`);
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
  createEvent(
    @Body() data,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    data.organizerId = req.user.id;
    if (file) {
      data.poster = file.filename;
    }
    return this.eventsService.createEvent(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update event', description: 'Update an existing event with optional poster image upload' })
  @ApiParam({ name: 'id', example: 1, description: 'ID of the event to update' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully', type: Event })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `poster-${uniqueSuffix}${ext}`);
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
  updateEvent(
    @Param('id') id: string,
    @Body() data,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      data.poster = file.filename;
    }
    return this.eventsService.updateEvent(Number(id), data, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register for event', description: 'Register the authenticated user for an event with specified seat type' })
  @ApiParam({ name: 'id', example: 1, description: 'ID of the event to register for' })
  @ApiBody({ type: RegisterEventDto })
  @ApiResponse({ status: 201, description: 'Successfully registered for event' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Registration failed (e.g., event full)' })
  register(@Param('id') id: string, @Body() body: { seatType?: string }, @Req() req) {
    return this.eventsService.registerForEvent(Number(id), req.user, body.seatType || 'standard');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/cancel')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cancel event registration', description: 'Cancel the authenticated user\'s registration for an event' })
  @ApiParam({ name: 'id', example: 1, description: 'ID of the event to cancel registration for' })
  @ApiResponse({ status: 200, description: 'Registration cancelled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Registration not found' })
  cancelRegistration(@Param('id') id: string, @Req() req) {
    return this.eventsService.cancelRegistration(Number(id), req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete event', description: 'Delete an event (organizer or admin only)' })
  @ApiParam({ name: 'id', example: 1, description: 'ID of the event to delete' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this event' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  deleteEvent(@Param('id') id: string, @Req() req) {
    return this.eventsService.deleteEvent(Number(id), req.user);
  }

  @UseGuards(JwtAuthGuard)
  // ✅ Export attendees as CSV or PDF
  @Get(':id/export')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export attendees', description: 'Export event attendees list as CSV or PDF' })
  @ApiParam({ name: 'id', example: 1, description: 'ID of the event' })
  @ApiQuery({ name: 'type', example: 'csv', enum: ['csv', 'pdf'], description: 'Export format type' })
  @ApiResponse({ status: 200, description: 'Attendees list exported successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid export type' })
  async exportAttendees(
    @Param('id') eventId: string,
    @Query('type') type: string,
    @Res({ passthrough: true }) res: Response, // ✅ passthrough
  ): Promise<Buffer | { message: string }> {
    const file = await this.eventsService.exportAttendees(Number(eventId), type);
  
    if (type === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="event_${eventId}_attendees.csv"`,
      );
    } else if (type === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="event_${eventId}_attendees.pdf"`,
      );
    } else {
      return { message: 'Invalid export type' };
    }
  
    // ✅ Return the file buffer, NestJS will send it automatically
    return file;
  }
  


}
