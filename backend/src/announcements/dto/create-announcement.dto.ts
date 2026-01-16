import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Important Update', description: 'Title of the announcement' })
  title: string;

  @ApiProperty({ 
    example: 'The event venue has been changed to the Grand Hall', 
    description: 'Message content of the announcement' 
  })
  message: string;

  @ApiProperty({ 
    example: 1, 
    description: 'ID of the event this announcement is for (optional)',
    required: false 
  })
  eventId?: string;

  @ApiProperty({ 
    type: 'string', 
    format: 'binary', 
    description: 'Announcement image file',
    required: false
  })
  image?: any;
}
