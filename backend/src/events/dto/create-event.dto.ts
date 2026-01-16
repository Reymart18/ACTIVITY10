import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2026', description: 'The title of the event' })
  title: string;

  @ApiProperty({ 
    example: 'An exciting technology conference featuring the latest innovations', 
    description: 'Detailed description of the event' 
  })
  description: string;

  @ApiProperty({ example: 'Grand Convention Center, New York', description: 'The location where the event takes place' })
  location: string;

  @ApiProperty({ example: '2026-03-15T09:00:00.000Z', description: 'The start date and time of the event' })
  startDate: string;

  @ApiProperty({ example: '2026-03-15T18:00:00.000Z', description: 'The end date and time of the event' })
  endDate: string;

  @ApiProperty({ example: 500, description: 'Maximum capacity for standard tickets' })
  standardCapacity: number;

  @ApiProperty({ example: 100, description: 'Maximum capacity for VIP tickets' })
  vipCapacity: number;

  @ApiProperty({ 
    type: 'string', 
    format: 'binary', 
    description: 'Event poster image file',
    required: false
  })
  poster?: any;
}
