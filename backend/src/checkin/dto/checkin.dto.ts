import { ApiProperty } from '@nestjs/swagger';

export class CheckinDto {
  @ApiProperty({ 
    example: 'TKT-ABC123XYZ', 
    description: 'Unique reference code of the ticket to check in' 
  })
  referenceCode: string;
}
