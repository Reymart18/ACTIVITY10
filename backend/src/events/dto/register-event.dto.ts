import { ApiProperty } from '@nestjs/swagger';

export class RegisterEventDto {
  @ApiProperty({ 
    example: 'standard', 
    enum: ['standard', 'vip'],
    description: 'Type of seat to register for',
    default: 'standard'
  })
  seatType?: string;
}
